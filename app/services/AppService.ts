import { makeAutoObservable, reaction } from "mobx"
import { StorageService } from "./StorageService"
import { inject } from "react-ioc"
import { WalletConnectService } from "./WalletConnectService"
import { ProviderService } from "./ProviderService"

export class AppService {

  initialized = false
  destructor = () => null

  storage = inject(this, StorageService)
  wc = inject(this, WalletConnectService)
  provider = inject(this, ProviderService)

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
      this.provider.init()
    })
  }
}
