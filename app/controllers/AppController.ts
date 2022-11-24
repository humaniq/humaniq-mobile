import { makeAutoObservable, reaction } from "mobx"
import { StorageController } from "./StorageController"
import { inject } from "react-ioc"
import { WalletConnectController } from "./WalletConnectController"
import { Web3Controller } from "./Web3Controller"
import { WalletController } from "./WalletController"

export class AppController {

  initialized = false
  destructor = () => null
  destructor2 = () => null

  storage = inject(this, StorageController)
  wc = inject(this, WalletConnectController)
  web3 = inject(this, Web3Controller)
  wallet = inject(this, WalletController)

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
      this.wallet.tryInitCached()
      this.web3.init()
    })
    this.destructor2()
    this.destructor2 = reaction(() => this.wallet.address, (val, prev) => {
      console.log(val, prev)
      if (!val || val?.toLowerCase() === prev?.toLowerCase()) return
      console.log("Need to update some services...")
    })
  }
}
