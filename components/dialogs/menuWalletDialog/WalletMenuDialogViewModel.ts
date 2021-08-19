import { makeAutoObservable } from "mobx";
import { Wallet } from "../../../store/wallet/Wallet";
import { t } from "../../../i18n";
import { getWalletStore } from "../../../store/wallet/WalletStore";

export class WalletMenuDialogViewModel {
  pending = false;
  display = false;
  message = "";
  wallet: Wallet;
  
  items = [
    {
      name: t("walletMenuDialog.hideWallet"),
      action: async () => {
        this.display = false;
        await getWalletStore().removeWallet(this.wallet.address);
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
