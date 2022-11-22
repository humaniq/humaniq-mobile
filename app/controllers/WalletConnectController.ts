import { makeAutoObservable } from "mobx"
import WC from "@walletconnect/client"

export class WalletConnectController {
  connector: WC
  initialized = false

  init = (connector: WC) => {
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
