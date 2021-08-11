import { makeAutoObservable, runInAction } from "mobx";
import { walletStore } from "../../../store/wallet/WalletStore";

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
    return walletStore.getDefault().wallets.find(w => w.address === this.currentWalletAddress);
  }
  
  sendTransaction() {
  
  }
  
  async init(address) {
    this.currentWalletAddress = address;
    
    // observe(ServiceWallet.wallets.find(w => w.address === this.currentWalletAddress).balance, (value) => {
    //   console.tron.log("BALANCE-changed")
    //   console.tron.log(value)
    // })
    this.initialized = true;
    try {
      await this.wallet.updateBalance();
    } catch (e) {
      console.log(e);
    } finally {
      runInAction(() => {
        this.initialized = true;
      });
    }
  }
}
