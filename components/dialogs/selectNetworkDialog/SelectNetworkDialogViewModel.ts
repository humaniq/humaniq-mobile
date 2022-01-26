import { makeAutoObservable } from "mobx"
import { ETHEREUM_NETWORKS, NETWORK_TYPE } from "../../../config/network";
import { t } from "../../../i18n";

export class SelectNetworkDialogViewModel {

  display = false

  get mainNetworks() {
    return Object.values(ETHEREUM_NETWORKS).filter(n => n.env === NETWORK_TYPE.PRODUCTION)
  }

  get testNetworks() {
    return Object.values(ETHEREUM_NETWORKS).filter(n => n.env === NETWORK_TYPE.TEST)
  }

  get networks() {
    return [
      { tittle: t("settingsScreen.menu.mainNets"), items: this.mainNetworks },
      { tittle: t("settingsScreen.menu.testNets"), items: this.testNetworks }
    ]
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
}