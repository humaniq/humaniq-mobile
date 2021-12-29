import { makeAutoObservable } from "mobx"
import { getWalletStore } from "../../../App"

export class SelectWalletDialogViewModel {

  display = false

  get options() {
    return getWalletStore().wallets
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
}