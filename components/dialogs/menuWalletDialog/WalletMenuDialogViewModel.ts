import { makeAutoObservable } from "mobx";
import { Wallet } from "../../../store/wallet/Wallet";
import { t } from "../../../i18n";
import { getActiveRouteName, RootNavigation } from "../../../navigators";
import { NavigationProp } from "@react-navigation/native";
import { getWalletStore } from "../../../App"

export class WalletMenuDialogViewModel {
  pending = false;
  display = false;
  message = "";
  wallet: Wallet;
  nav: NavigationProp<any>;

  items = [
    {
      name: t("walletMenuDialog.hideWallet"),
      action: async () => {
        this.display = false;
        const rootState = RootNavigation.getRootState();
        if (getActiveRouteName(rootState) === "wallet-eth") {
          RootNavigation.goBack();
          setTimeout(async () => {
            await getWalletStore().removeWallet(this.wallet.address);
          }, 1000);
        } else {
          await getWalletStore().removeWallet(this.wallet.address);
        }
      },
      icon: "eye-slash"
    }
  ];

  constructor() {
    makeAutoObservable(this);
  }

  open(w: Wallet) {
    this.wallet = w;
    this.display = true;
  }
}
