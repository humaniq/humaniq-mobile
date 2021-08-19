import { makeAutoObservable, runInAction } from "mobx";
import { getWalletStore } from "../../../store/wallet/WalletStore";

export class WalletEtherScreenModel {
  initialized = false;
  currentWalletAddress;
  
  walletDialogs: {
    pending: false
    send: { display: false }
  };
  
  constructor() {
    makeAutoObservable(this);
  }
  
  get sendDisabled() {
    return false;
  }
  
  get wallet() {
    return getWalletStore().wallets.find(w => w.address === this.currentWalletAddress);
  }
  
  async init(address) {
    this.currentWalletAddress = address;
    
    // observe(ServiceWallet.wallets.find(w => w.address === this.currentWalletAddress).balance, (value) => {
    //   console.tron.log("BALANCE-changed")
    //   console.tron.log(value)
    // })
    this.initialized = true;
    try {
      await this.wallet.updateBalanceFromApi();
    } catch (e) {
      console.log("ERROR", e);
    } finally {
      runInAction(() => {
        this.initialized = true;
      });
    }
  }
}
