import { makeAutoObservable, reaction } from "mobx"
import { StorageService } from "./StorageService"
import { inject } from "react-ioc"
import { WalletConnectService } from "./WalletConnectService"
import { ProviderService } from "./ProviderService"
import { WalletService } from "./WalletService"

export class AppService {

  initialized = false
  destructor = () => null

  storage = inject(this, StorageService)
  wc = inject(this, WalletConnectService)
  provider = inject(this, ProviderService)
  walletService = inject(this, WalletService)

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
