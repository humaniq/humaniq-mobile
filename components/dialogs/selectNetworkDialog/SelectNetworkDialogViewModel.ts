import { makeAutoObservable } from "mobx"
import { ETHEREUM_NETWORKS, NETWORK_TYPE } from "../../../config/network";

export class SelectNetworkDialogViewModel {

  display = false

  get mainNetworks() {
    return Object.values(ETHEREUM_NETWORKS).filter(n => n.env === NETWORK_TYPE.PRODUCTION)
  }

  get testNetworks() {
    return Object.values(ETHEREUM_NETWORKS).filter(n => n.env === NETWORK_TYPE.TEST)
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
}