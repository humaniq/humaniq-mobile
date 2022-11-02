import { makeAutoObservable, reaction, runInAction } from "mobx"
import { networks } from "../references/networks"
import WalletConnectProvider from "@walletconnect/web3-provider"
import { getAPIKey } from "../references/keys"
import { ethers } from "ethers"
import { inject } from "react-ioc"
import { WalletConnectService } from "./WalletConnectService"

export class ProviderService {

  provider
  account
  signer
  chainId
  initialized = false
  hasProvider = false
  isConnecting = false

  wc = inject(this, WalletConnectService)


  constructor() {
    makeAutoObservable(this)
  }

  setProvider = async () => {
    const rpc: Record<number, string> = []
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
    this.account = result[0]
    console.log(this.account)
    this.provider = new ethers.providers.Web3Provider(provider)
    this.initProvider()
    await this.connectWC()
    console.log(this.wc.connector)
    console.log(this.provider)
  }

  initProvider = () => {
    if (!this.provider) return

    const { provider } = this.provider

    provider.on("accountsChanged", this.handleAccountsChange)
    provider.on("disconnect", this.handleDisconnect)
    provider.on("chainChanged", this.handleChainChange)

    this.signer = this.provider.getSigner()

  }

  unmountProvider = () => {
    this.account = null
    this.provider = null
  }

  handleAccountsChange = async (accounts: string[]) => {
    if (this.account === accounts[0]) return
    this.account = accounts[0]
  }

  handleDisconnect = () => {
    this.account = null
  }

  handleChainChange = async (info: any) => {
    this.chainId = typeof info === "object" ? +info.chainId : +info
  }

  connectWC = async () => {
    if (!this.provider || this.provider?.provider.currentAccount)
      return

    if (this.isConnecting) return

    this.isConnecting = true

    try {
      let chainId = this.chainId

      if (!chainId) {
        chainId = await this.provider.provider.request({
          method: "eth_chainId",
        })
      }

      const chain = Object.values(networks).find(item => item.chainId === chainId)

      runInAction(() => {
        if (chain) {
          this.chainId = chain.chainId
        } else {
          // not supported
          this.chainId = chainId
          this.initialized = false
          this.provider.provider.onDisconnect()
          this.provider = null
        }
      })
    } catch (e) {
      console.log("ERROR", e)
    } finally {
      runInAction(() => {
        this.isConnecting = false
      })
    }
  }

  init = async () => {
    reaction(() => this.wc?.connected, async (val) => {
      console.log("provider-connected", val)
      val ? await this.setProvider() : this.unmountProvider()
    })
  }
}


