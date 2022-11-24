import { makeAutoObservable, reaction } from "mobx"
import { AvailableNetworks, networks } from "../references/networks"
import WalletConnectProvider from "@walletconnect/web3-provider"
import { getAPIKey } from "../references/keys"
import { BigNumber, ethers } from "ethers"
import { inject } from "react-ioc"
import { WalletConnectController } from "./WalletConnectController"
import { ProviderType } from "../references/providers"
import { Linking } from "react-native"
import BackgroundTimer from "react-native-background-timer"
import MetaMaskSDK from "@metamask/sdk"
import { localStorage } from "utils/localStorage"
import { getNetworkByChainId } from "../references/references"
import { Network } from "../references/network"
import { UECode, UnexpectedError } from "utils/error/UnexpectedError"
import { isRejectedRequestError, isUnrecognizedChainError } from "utils/error/ProviderRPCError"
import { EECode, ExpectedError } from "utils/error/ExpectedError"
import { addSentryBreadcrumb } from "../logs/sentry"
import { utf8ToHex } from "web3-utils"
import { ConfirmOwnershipController } from "./ConfirmOwnershipController"

export const WALLET_TYPE_CONNECTED = "MoverConnectedProvider"

export class Web3Controller {

  initialized = false
  pending = false
  provider: ethers.providers.Web3Provider
  address: string
  signer: ethers.providers.JsonRpcSigner
  chainId: number = -1
  balance: string = ""
  destructor1 = () => null
  destructor2 = () => null

  ethereum

  constructor() {
    makeAutoObservable(this, null, { autoBind: true })
  }

  wc: WalletConnectController = inject(this, WalletConnectController)
  ownershipModal = inject(this, ConfirmOwnershipController)

  tryConnectCachedProvider = async () => {
    const provider = await localStorage.load(WALLET_TYPE_CONNECTED)

    addSentryBreadcrumb({
      type: "info",
      message: provider ? `Wallet initialize (from cache)...${ provider }` : "Could not find cached provider",
    })

    if (provider) {
      await this.pureConnect(provider as ProviderType, true)
      return true
    }
    return false
  }

  init = async () => {
    this.destructor1()
    this.destructor1 = reaction(() => this.chainId, async (val, prev) => {
      if (prev === val || val === -1) return
      this.setBalance(val <= 0 ? 0 : await this.getBalance())
    })

    this.destructor2()
    this.destructor2 = reaction(() => this.address, async (val, prev) => {
      if (prev === val || val === "" || val === prev) return
      this.setBalance(await this.getBalance())
    })

    this.initialized = true
  }

  get isConnected() {
    return this.chainId >= 1
  }

  get shortAddress() {
    return this.address ? `${ this.address.slice(0, 6) }...${ this.address.slice(this.address.length - 4) }` : undefined
  }

  connect = async (providerType: ProviderType = ProviderType.Metamask): Promise<void> => {
    try {
      await this.pureConnect(providerType)
    } catch (e) {
      if (typeof e === "object" && e) {
        const err: Record<string, unknown> = e as Record<string, unknown>
        if (
          "message" in err &&
          err.message &&
          typeof err.message === "string" &&
          [
            "user rejected the request.",
            "user closed modal",
            "user denied account authorization",
          ].includes(err.message.toLowerCase())
        ) {
          throw new ExpectedError(EECode.userRejectAuth)
        }
      }
      console.error("error when connect to provider, try clean localstorage and try again", e)

      // wallet connect sometimes maybe good, sometimes maybe shit
      // Object.entries(localStorage)
      //   .map((x) => x[0])
      //   .filter((x) => x.startsWith('-walletlink') || x.includes('walletconnect'))
      //   .forEach((x) => localStorage.removeItem(x));

      try {
        await this.pureConnect(providerType)
      } catch (err) {
        console.error("error when retry connect to provider", err)
        throw new UnexpectedError(UECode.ConnectProviderWeb3CleanCache)
      }
    }
  }

  pureConnect = async (provider = ProviderType.WalletConnect, fromCache = false) => {
    try {
      this.pending = true
      if (false) {
        // Bad working service, for metamask can be used Wallet Connect service
        const MMSDK = new MetaMaskSDK({
          openDeeplink: (link) => {
            Linking.openURL(link) // Use React Native Linking method or your favourite way of opening deeplinks
          },
          timer: BackgroundTimer, // To keep the app alive once it goes to background
          dappMetadata: {
            name: "Mover mobile", // The name of your application
            url: "https://app.viamover.com/", // The url of your website
          },
        })

        this.ethereum = MMSDK.getProvider()
        this.provider = new ethers.providers.Web3Provider(this.ethereum, "any")
        this.setAddress((await this.getAccounts())[0])

      } else if (provider === ProviderType.WalletConnect || provider === ProviderType.Metamask) {

        await this.wc.connector.connect()

        const rpc: Record<number, string> = {}

        Object.entries(networks).forEach(([ , networkInfo ]) => {
          rpc[networkInfo.chainId] = networkInfo.rpcUrl[0]
        })

        this.ethereum = new WalletConnectProvider({
          rpc,
          infuraId: getAPIKey("INFURA_PROJECT_ID"),
          connector: this.wc.connector,
          qrcode: false,
        })
        const result = await this.ethereum.enable()
        this.provider = new ethers.providers.Web3Provider(this.ethereum, "any")
        this.setAddress(result[0])
      } else {
        return
      }

      this.setChainId(await this.getChainId())
      this.setBalance(await this.getBalance())

      await localStorage.save(WALLET_TYPE_CONNECTED, provider)

      addSentryBreadcrumb({
        type: "info",
        massage: `Save cached provider:${ await localStorage.load(WALLET_TYPE_CONNECTED) }`,
      })

      this.provider?.removeAllListeners()
      // @ts-ignore
      this.provider?.provider?.on("accountsChanged", this.handleAccountsChange)
      // @ts-ignore
      this.provider?.provider?.on("disconnect", this.handleDisconnect)
      // @ts-ignore
      this.provider?.provider?.on("chainChanged", this.handleChainChange)

      // Check if chain supported
      const chain = Object.values(networks).find(item => item.chainId === this.chainId)

      if (!chain) {
        this.setChainId(1)
        // need request change chain
        await this.provider.send("wallet_switchEthereumChain", [ `0x${ networks.ethereum.chainId.toString(16) }` ])
      }

    } catch (e) {
      await this.disconnect()
    } finally {
      this.pending = false
    }
  }

  get isNetworkSupported() {
    return !this.chainId || Object.values(networks).find(item => item.chainId === this.chainId)
  }

  handleAccountsChange = async (accounts: string[]) => {
    if (this.address === ethers.utils.getAddress(accounts[0])) return
    console.log("set-address")
    this.address = accounts[0] ? ethers.utils.getAddress(accounts[0]) : ""
    // this.setAddress(accounts[0])
  }
  handleDisconnect = async () => {
    await this.disconnect()
  }

  disconnect = async () => {
    addSentryBreadcrumb({ type: "info", message: "Disconnect wallet" })
    try {
      this.setAddress("")
      this.setChainId(-1)
      this.ownershipModal.modal.closeModal()

      const provider = await localStorage.load(WALLET_TYPE_CONNECTED)
      if (provider) {
        try {
          await this.wc?.connector?.killSession()
        } catch (e) {
          console.log(e)
        }
      }

      this.provider = null

      await localStorage.remove(WALLET_TYPE_CONNECTED)
    } catch (e) {
      console.log("ERROR-disconnect", e)
    }
  }

  handleChainChange = async (info: any) => {
    this.chainId = typeof info === "object" ? +info.chainId : +info
  }

  setAddress = (address) => {
    this.address = address ? ethers.utils.getAddress(address) : ""
    addSentryBreadcrumb({ type: "info", message: `Set wallet address: ${ this.address }` })
  }

  setBalance = (balance) => {
    this.balance = balance
    addSentryBreadcrumb({ type: "info", message: `Set wallet balance: ${ this.balance }` })
  }

  getBalance = async () => {
    try {
      const balance = await this.provider.getBalance(this.address)
      return balance.toString()
    } catch (e) {
      return ""
    }
  }

  setChainId = (chainId) => {
    this.chainId = BigNumber.from(chainId).toNumber()
    addSentryBreadcrumb({ type: "info", message: `Set chainId: ${ this.chainId }` })
  }

  getChainId = async () => {
    try {
      const chainId = await this.ethereum.request({ method: "eth_chainId", params: [] })
      return BigNumber.from(chainId).toNumber()
    } catch (e) {
      return -1
    }
  }

  getAccounts = async () => {
    try {
      return await this.ethereum.request({ method: "eth_requestAccounts", params: [] })
    } catch (e) {
      addSentryBreadcrumb({ type: "error", message: `Error request accounts: ${ this.chainId }` })
    }
  }

  get network() {
    return getNetworkByChainId(this.chainId)?.network ?? Network.ethereum
  }

  changeNetwork = async (network: Network) => {
    if (!AvailableNetworks.includes(network)) {
      throw new UnexpectedError(UECode.UnsupportedNetwork)
    }

    if (!this.isConnected || this.provider === undefined) {
      throw new UnexpectedError(UECode.notConnected)
    }

    const networkInfo = networks[network]

    try {
      await this.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [ `0x${ networkInfo.chainId.toString(16) }` ],
      })
    } catch (error) {
      if (isRejectedRequestError(error)) {
        throw new ExpectedError(EECode.userRejectNetworkChange)
      }

      if (isUnrecognizedChainError(error)) {
        try {
          await (this.ethereum.request({
              method: "wallet_addEthereumChain", params: [
                {
                  chainId: `0x${ networkInfo.chainId.toString(16) }`,
                  chainName: networkInfo.name,
                  rpcUrls: networkInfo.rpcUrl,
                  nativeCurrency: {
                    name: networkInfo.baseAsset.name,
                    symbol: networkInfo.baseAsset.symbol,
                    decimals: networkInfo.baseAsset.decimals,
                  },
                  blockExplorerUrls: [ networkInfo.explorer ],
                },
              ],
            })
          )
        } catch (error) {
          if (isRejectedRequestError(error)) {
            throw new ExpectedError(EECode.userRejectNetworkChange)
          }
          throw new ExpectedError(EECode.addNetworkToProvider)
        }
      } else {
        throw new ExpectedError(EECode.switchProviderNetwork)
      }
    }
  }

  signMessage = async (message: string) => {
    const hashedMessage = utf8ToHex(message)
    // return await this.ethereum.request({ method: "personal_sign", params: [ hashedMessage, this.address, "" ] })
    return await this.wc.connector.signPersonalMessage([ hashedMessage, this.address ])
  }
}
