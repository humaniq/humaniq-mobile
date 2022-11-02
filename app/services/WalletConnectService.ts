import { makeAutoObservable } from "mobx"
import WalletConnect from "@walletconnect/client"

export class WalletConnectService {
  connector: WalletConnect
  connected = false
  // providerService = inject(this, ProviderService);

  init = (connector: WalletConnect) => {
    this.connector = connector
    this.connected = this.connector.connected
  }

  constructor() {
    makeAutoObservable(this, null, { autoBind: true })
  }
}
