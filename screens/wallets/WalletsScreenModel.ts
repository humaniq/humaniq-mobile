import { makeAutoObservable } from "mobx";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { t } from "../../i18n";
import { getAppStore, getWalletStore } from "../../App"
import { runUnprotected } from "mobx-keystone";
import { TOAST_POSITION } from "../../components/toasts/appToast/AppToast";


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
      cancellation: false,
      position: TOAST_POSITION.BOTTOM
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
    return getAppStore().walletPageInitialized && getWalletStore().allWalletsInitialized
  }

  async init(force = false) {
    try {
      if (!this.initialized || force || !getAppStore().walletPageInitialized) {
        await getWalletStore().updateWalletsInfo();
      }
      this.initialized = true;
      runUnprotected(() => {
        getAppStore().walletPageInitialized = true
      })
    } catch (e) {
      console.log("INIT ERROR", e);
    }
  }

  async onRefresh() {
    this.refreshing = true;
    await getWalletStore().updateWalletsInfo();
    this.refreshing = false
  }

  async createWalletDialog(position = TOAST_POSITION.BOTTOM) {
    try {
      this.walletDialogs.menu.display = false;
      this.walletDialogs.pendingDialog.position = position
      this.walletDialogs.pendingDialog.display = true;
      setTimeout(async () => {
        await getWalletStore().addWallet()
        setTimeout(() => {
          this.walletDialogs.pendingDialog.walletCreated = true
          setTimeout(() => {
            this.walletDialogs.pendingDialog.display = false;
            this.walletDialogs.pendingDialog.position = TOAST_POSITION.BOTTOM
            this.walletDialogs.pendingDialog.walletCreated = false
          }, 3000)
        }, 10)
      }, 10)
    } catch (e) {
      console.log("ERROR", e);
      this.walletDialogs.pendingDialog.position = TOAST_POSITION.BOTTOM
      this.walletDialogs.pendingDialog.display = false;
      this.walletDialogs.pendingDialog.walletCreated = false
    }
  }
}