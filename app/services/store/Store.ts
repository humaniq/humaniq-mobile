import { makeAutoObservable } from "mobx"
import { Wallet } from "./Wallet"

export class Store {
  wallets: { [key: string]: Wallet }
  
  constructor() {
    makeAutoObservable(this)
  }
}

export const store = new Store()
