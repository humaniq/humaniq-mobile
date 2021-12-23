import { makeAutoObservable } from "mobx"
import { getEthereumProvider } from "../../../App"
import { runUnprotected } from "mobx-keystone"
import { ETHEREUM_NETWORKS } from "../../../config/network";
import * as storage from "../../../utils/localStorage";

export class SelectNetworkDialogViewModel {

  display = false

  get options() {
    return Object.values(ETHEREUM_NETWORKS).map((w, i) => ({
      label: w.name,
      onPress: () => runUnprotected(() => {
        runUnprotected(() => {
          getEthereumProvider().currentNetworkName = w.name
        })
        storage.save("currentNetworkName", w.name)
      }),
      onOptionPress: () => runUnprotected(() => {
        runUnprotected(() => {
          getEthereumProvider().currentNetworkName = w.name
        })
        storage.save("currentNetworkName", w.name)
      })
    }))
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
}