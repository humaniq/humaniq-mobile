import { makeAutoObservable } from "mobx";
import WalletConnect from "@walletconnect/client";

export class WalletConnectService {
  connector: WalletConnect

  init = (connector) => {
    this.connector = connector
    console.log(connector)
  }

  constructor() {
    makeAutoObservable(this, null, {autoBind: true})
  }
}
