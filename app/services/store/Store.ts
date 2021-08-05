import { makeAutoObservable } from "mobx"
import { WalletStore } from "./WalletStore"

// import * as storage from "../../utils/storage"

export class Store {
  initialized = false
  walletStore: WalletStore
  
  constructor() {
    makeAutoObservable(this)
    this.walletStore = new WalletStore()
    this.initialized = true
  }
}

export const store = new Store()
