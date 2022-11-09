import { makeAutoObservable, reaction } from "mobx"
import { networks } from "../references/networks"
import WalletConnectProvider from "@walletconnect/web3-provider"
import { getAPIKey } from "../references/keys"
import { BigNumber, ethers } from "ethers"
import { inject } from "react-ioc"
import { WalletConnectService } from "./WalletConnectService"
import { Web3Provider } from "@ethersproject/providers/src.ts/web3-provider"
import { ProviderType } from "../references/providers"
import { Linking } from "react-native"
import BackgroundTimer from "react-native-background-timer"
import MetaMaskSDK from "@metamask/sdk"
import { localStorage } from "utils/localStorage"

export const WALLET_TYPE_CONNECTED = "Mover-wallet-type-connected"

export class ProviderService {

  initialized = false
  pending = false
  provider: Web3Provider
  address: string
  signer
  chainId: number = -1
  balance: string = ""
  destructor1 = () => null
  destructor2 = () => null

  wc: WalletConnectService = inject(this, WalletConnectService)


  constructor() {
    makeAutoObservable(this)
  }

  init = async () => {
    const provider = await localStorage.load(WALLET_TYPE_CONNECTED)
    if (provider) {
      await this.setProvider(provider as ProviderType, true)
    }
    this.destructor1()
    this.destructor1 = reaction(() => this.chainId, async (val, prev) => {
      if (prev === val || val === -1) return
      this.setBalance(val <= 0 ? 0 : await this.getBalance())
    })

    this.destructor2()
    this.destructor2 = reaction(() => this.address, async (val, prev) => {
      if (prev === val || val === "") return
      this.setBalance(await this.getBalance())
    })

    this.initialized = true
  }

  get connected() {
    return this.chainId >= 1
  }

  setProvider = async (provider = ProviderType.WalletConnect, fromCache = false) => {
    try {
      this.pending = true
      if (provider === ProviderType.Metamask) {

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


        const provider = MMSDK.getProvider()
        this.provider = new ethers.providers.Web3Provider(provider, "any")
        this.setAddress((await this.getAccounts())[0])

      } else if (provider === ProviderType.WalletConnect) {

        try {
          await this.wc.connector.connect()
        } catch (e) {
          console.log("ERROR-set-provider", e)
        }

        const rpc: Record<number, string> = {}

        Object.entries(networks).forEach(([ , networkInfo ]) => {
          rpc[networkInfo.chainId] = networkInfo.rpcUrl[0]
        })

        const provider = new WalletConnectProvider({
          rpc,
          infuraId: getAPIKey("INFURA_PROJECT_ID"),
          connector: this.wc.connector,
          qrcode: false,
        })

        const result = await provider.enable()
        this.provider = new ethers.providers.Web3Provider(provider, "any")
        this.signer = this.provider.getSigner()
        this.setAddress(result[0])
      } else {
        return
      }

      this.setChainId(await this.getChainId())
      this.setBalance(await this.getBalance())

      await localStorage.save(WALLET_TYPE_CONNECTED, provider)

      this.provider.removeAllListeners()
      this.provider.provider.on("accountsChanged", this.handleAccountsChange)
      this.provider.provider.on("disconnect", this.handleDisconnect)
      this.provider.provider.on("chainChanged", this.handleChainChange)


      // Check if chain supported
      const chain = Object.values(networks).find(item => item.chainId === this.chainId)

      if (!chain) {
        this.setChainId(1)
        // need request change chain
        await this.provider.send("wallet_switchEthereumChain", [ `0x${ networks.ethereum.chainId.toString(16) }` ])
      }


    } catch (e) {
      console.log("Error-set-provider", e)
      await localStorage.remove(WALLET_TYPE_CONNECTED)
    } finally {
      this.pending = false
    }
  }

  get isNetworkSupported() {
    return !this.chainId || Object.values(networks).find(item => item.chainId === this.chainId)
  }

  handleAccountsChange = async (accounts: string[]) => {
    console.log("accounts changed", accounts)
    if (this.address === accounts[0]) return
    this.address = accounts[0]
  }

  handleDisconnect = async () => {
    console.log("on disconnect")
    await this.disconnect()
  }

  disconnect = async () => {
    console.log("disconnect")
    try {
      this.setAddress("")
      this.setChainId(-1)

      const provider = await localStorage.load(WALLET_TYPE_CONNECTED)
      if (provider && provider === ProviderType.WalletConnect) {
        await this.wc?.connector?.killSession()
      }

      this.provider = null

      await localStorage.remove(WALLET_TYPE_CONNECTED)
    } catch (e) {
      console.log("ERROR-disconnect", e)
    }
  }

  handleChainChange = async (info: any) => {
    console.log("chain changed", info)
    this.chainId = typeof info === "object" ? +info.chainId : +info
  }

  setAddress = (address) => {
    this.address = address
    console.log("Set-address", this.address)
  }

  setBalance = (balance) => {
    this.balance = balance
    console.log("Set-balance", this.balance)
  }

  getBalance = async () => {
    try {
      const balance = await this.provider.getBalance(this.address)
      return balance.toString()
    } catch (e) {
      console.log("ERROR-get-balance", e)
      return ""
    }
  }

  setChainId = (chainId) => {
    this.chainId = BigNumber.from(chainId).toNumber()
    console.log("Set-chainId", this.chainId)
  }

  getChainId = async () => {
    try {
      const chainId = await this.provider.send("eth_chainId", [])
      return BigNumber.from(chainId).toNumber()
    } catch (e) {
      console.log("Error-get-chain-id", e)
      return -1
    }
  }

  getAccounts = async () => {
    try {
      return await this.provider.send("eth_requestAccounts", [])
    } catch (e) {
      console.log("ERROR-get-accounts", e)
    }
  }
}