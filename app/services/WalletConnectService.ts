import { makeAutoObservable } from "mobx"
import WalletConnect from "@walletconnect/client"

export class WalletConnectService {
  connector: WalletConnect
  initialized = false

  init = (connector: WalletConnect) => {
    this.connector = connector
    this.initialized = true
  }

  get connected() {
    return this.connector.connected
  }

  constructor() {
    makeAutoObservable(this, null, { autoBind: true })
  }
}
