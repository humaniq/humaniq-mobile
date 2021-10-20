import { makeAutoObservable } from "mobx";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { t } from "../../i18n";
import { getWalletStore } from "../../App"


export class WalletsScreenModel {
  initialized = false;
  refreshing = false;

  activeIndex = 0

  walletDialogs = {
    pending: false,
    pendingDialog: {
      display: false,
      message: t("walletScreen.menuDialog.createWallet.createWalletMessage"),
      walletCreated: false,
      cancellation: false
    },
    menu: {
      display: false,
      items: [
        {
          name: t("walletScreen.menuDialog.createWallet.name"), action: this.createWalletDialog,
          icon: "plus-circle"
        }
      ]
    }
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get walletAddresses() {
    return getWalletStore().allWallets.map(w => ({ address: w.address }))
  }

  get currentWallet() {
    return getWalletStore().allWallets[this.activeIndex]
  }

  get allWallets() {
    return getWalletStore().allWallets
  }

  get allInitialized() {
    return getWalletStore().allWalletsInitialized
  }

  async init() {
    try {
      if (this.initialized) return
      await getWalletStore().updateWalletsInfo();
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

  async createWalletDialog() {
    try {
      this.walletDialogs.menu.display = false;
      this.walletDialogs.pendingDialog.display = true;
      setTimeout(async () => {
        await getWalletStore().addWallet()
        setTimeout(() => {
          this.walletDialogs.pendingDialog.walletCreated = true
          setTimeout(() => {
            this.walletDialogs.pendingDialog.display = false;
            this.walletDialogs.pendingDialog.walletCreated = false
          }, 3000)
        }, 10)
      }, 10)
    } catch (e) {
      console.log("ERROR", e);
      this.walletDialogs.pendingDialog.display = false;
      this.walletDialogs.pendingDialog.walletCreated = false
    }
  }
}
