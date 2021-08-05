import { makeAutoObservable } from "mobx"
import * as storage from "../../utils/storage"
import { ethers } from "ethers"
import { amountFormat } from "../../utils/number"


export class Wallet {
  address: string
  name: string
  balance: number
  mnemonic: string
  path: string
  locale: string
  privateKey: string
  publicKey: string
  
  constructor({ address, name, balance, mnemonic, path, locale, privateKey, publicKey }) {
    makeAutoObservable(this)
    Object.assign(this, { address, name, balance, mnemonic, path, locale, privateKey, publicKey })
  }
  
  get formatAddress() {
    return this.address ? `${ this.address.slice(0, 4) }...${ this.address.substring(this.address.length - 4) }` : ""
  }
  
  get ethBalance() {
    return +ethers.utils.formatEther(ethers.BigNumber.from(this.balance.toString()))
  }
  
  get formatBalance() {
    return amountFormat(this.ethBalance, 8)
  }
}

export class WalletStore {
  initialized = false
  wallets: Array<Wallet>
  
  constructor() {
    makeAutoObservable(this)
    // eslint-disable-next-line no-array-constructor
    this.wallets = new Array<Wallet>()
  }
  
  init = async () => {
    if (!this.initialized) {
      const wallets = await storage.load("wallets") || {}
      // @ts-ignore
      this.wallets = Object.values(wallets).map(w => new Wallet(w)) || []
      console.tron.log("WALLETS", this.wallets)
      this.initialized = true
    }
  }
  
  addWallet = async (wallet: Wallet) => {
    this.wallets = [ ...this.wallets, wallet ]
    await storage.save("wallets", Object.values(this.wallets))
  }
  
  removeWallet = async (address: string) => {
    this.wallets = this.wallets.filter(w => w.address !== address)
    await storage.save("wallets", Object.values(this.wallets))
    
  }
}
