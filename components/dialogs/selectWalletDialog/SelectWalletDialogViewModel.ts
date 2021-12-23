import { makeAutoObservable } from "mobx"
import { getWalletStore } from "../../../App"
import { runUnprotected } from "mobx-keystone"

export class SelectWalletDialogViewModel {

  display = false

  get options() {
    return getWalletStore().wallets.map((w, i) => ({
      label: {
        address: w.formatAddress, balance: w.fiatBalance
      },
      onPress: () => runUnprotected(() => {
        console.log("press")
        getWalletStore().selectedWalletIndex = i
      }),
      onOptionPress: () => runUnprotected(() => {
        console.log("press")
        getWalletStore().selectedWalletIndex = i
      })
    }))
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
}