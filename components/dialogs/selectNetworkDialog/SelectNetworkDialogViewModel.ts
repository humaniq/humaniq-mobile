import { makeAutoObservable } from "mobx"
import { EVM_NETWORKS, NATIVE_COIN, NETWORK_TYPE } from "../../../config/network";
import { t } from "../../../i18n";

export class SelectNetworkDialogViewModel {

  display = false

  get networks() {
    return [
      {
        tittle: t("settingsScreen.menu.mainNets"),
        items: Object.values(EVM_NETWORKS).filter(n => n.env === NETWORK_TYPE.PRODUCTION)
      },
      {
        tittle: t("settingsScreen.menu.testNets"),
        items: Object.values(EVM_NETWORKS).filter(n => n.env === NETWORK_TYPE.TEST && n.nativeCoin === NATIVE_COIN.ETHEREUM)
      },
      {
        tittle: t("settingsScreen.menu.bscNets"),
        items: Object.values(EVM_NETWORKS).filter(n => n.env === NETWORK_TYPE.TEST && n.nativeCoin === NATIVE_COIN.BINANCECOIN)
      }
    ]
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
}
