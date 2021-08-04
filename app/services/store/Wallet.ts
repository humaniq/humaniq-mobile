import { makeAutoObservable } from "mobx"


export class Wallet {
  address: string
  name: string
  balance: number
  mnemonic: string
  path: string
  locale: string
  privateKey: string
  publicKey: string
  
  constructor() {
    makeAutoObservable(this)
  }
}
