import { makeAutoObservable } from "mobx";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { RootStore } from "../../store/RootStore";
import { t } from "../../i18n";
import { getWalletStore } from "../../App"


export class WalletsScreenModel {
  initialized = false;
  rootStore: RootStore;
  refreshing = false;


  walletDialogs = {
    pending: false,
    pendingDialog: {
      display: false,
      message: t("walletScreen.menuDialog.createWallet.createWalletMessage")
    },
    menu: {
      display: false,
      items: [
        {
          name: t("walletScreen.menuDialog.createWallet.name"), action: async () => {
            this.walletDialogs.menu.display = false;
            this.walletDialogs.pendingDialog.display = true;
            setTimeout(async () => {
              await this.addWallet();
            }, 500);
          },
          icon: "plus-circle"
        }
      ]
    }
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async init(rootStore) {
    this.rootStore = rootStore;
    try {
      this.initialized = true;
    } catch (e) {
      console.log("INIT ERROR", e);
    }
  }

  async onRefresh() {
    this.refreshing = true;
    await getWalletStore().updateWalletsInfo();
    this.refreshing = false
  }

  async addWallet() {
    try {
      await getWalletStore().addWallet()
    } catch (e) {
      console.log("ERROR", e);
    } finally {
      this.walletDialogs.pendingDialog.display = false;
    }
  }
}
