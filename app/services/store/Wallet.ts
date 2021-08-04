import { makeAutoObservable } from "mobx"
import { ethers } from "ethers"


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
  
  get formatedAddress() {
    return this.address ? `${ this.address.slice(0, 4) }...${ this.address.substring(this.address.length - 4) }` : ""
  }
  
  get ethBalance() {
    return ethers.utils.formatEther(ethers.BigNumber.from(this.balance.toString()))
  }
}
