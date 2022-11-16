import { makeAutoObservable, reaction } from "mobx"
import { StorageController } from "./StorageController"
import { inject } from "react-ioc"
import { WalletConnectController } from "./WalletConnectController"
import { ProviderController } from "./ProviderController"
import { WalletController } from "./WalletController"

export class AppController {

  initialized = false
  destructor = () => null

  storage = inject(this, StorageController)
  wc = inject(this, WalletConnectController)
  provider = inject(this, ProviderController)
  walletService = inject(this, WalletController)

  constructor() {
    makeAutoObservable(this, null, { autoBind: true })
  }

  increment = () => {
    console.log("increment")
    this.storage.counter++
  }

  get counter() {
    return this.storage.counter
  }

  init = () => {
    console.log("init app")
    this.destructor()
    this.destructor = reaction(() => this.wc.initialized, async () => {
      this.walletService.tryInitCached()
      this.provider.init()
    })
  }
}
