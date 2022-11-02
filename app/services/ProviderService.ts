import { makeAutoObservable, reaction } from "mobx"
import { networks } from "../references/networks"
import WalletConnectProvider from "@walletconnect/web3-provider"
import { getAPIKey } from "../references/keys"
import { ethers } from "ethers"
import { inject } from "react-ioc"
import { WalletConnectService } from "./WalletConnectService"
import { Web3Provider } from "@ethersproject/providers/src.ts/web3-provider"

export class ProviderService {

  provider: Web3Provider
  address: string
  signer
  chainId: number = -1
  balance: string = ""

  wc = inject(this, WalletConnectService)


  constructor() {
    makeAutoObservable(this)
  }

  init = async () => {
    reaction(() => this.wc?.connected, async (val) => {
      console.log("provider-connected", val)
      val ? await this.setProvider() : this.handleDisconnect()
    })
  }

  setProvider = async () => {
    try {
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
      this.provider = new ethers.providers.Web3Provider(provider)
      this.signer = this.provider.getSigner()

      this.setAddress(result[0])
      this.setBalance((await this.provider.getBalance(this.address)).toString())
      this.setChainId(await this.provider.send("eth_chainId", []))

      this.provider.on("accountsChanged", this.handleAccountsChange)
      this.provider.on("disconnect", this.handleDisconnect)
      this.provider.on("chainChanged", this.handleChainChange)


      // Check if chain supported
      const chain = Object.values(networks).find(item => item.chainId === this.chainId)

      if (!chain) {
        this.setChainId((chain.chainId))
        // need request change chain
        await this.provider.send("wallet_switchEthereumChain", [ networks.ethereum.chainId ])
      }
    } catch (e) {
      console.log("Error-set-provider", e)
    }
  }

  get isNetworkSupported() {
    return !this.chainId || Object.values(networks).find(item => item.chainId === this.chainId)
  }

  handleAccountsChange = async (accounts: string[]) => {
    if (this.address === accounts[0]) return
    this.address = accounts[0]
  }

  handleDisconnect = () => {
    this.address = null
  }

  handleChainChange = async (info: any) => {
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

  setChainId = (chainId) => {
    this.chainId = chainId
    console.log("Set-chainId", this.chainId)
  }

}


