import { makeAutoObservable, runInAction, toJS } from "mobx";
import "react-native-get-random-values";
import { NativeModules } from "react-native";
import "@ethersproject/shims";
import { ethers } from "ethers";
import { entropyToMnemonic } from "ethers/lib/utils";
import { RootStore } from "../../store/RootStore";
import { Wallet } from "../../store/wallet/Wallet";

export class WalletScreenModel {
  initialized = false;
  rootStore: RootStore;
  
  
  walletDialogs = {
    pending: false,
    init: { display: false, accept: false },
    proceed: {
      display: false,
      wallet: {
        mnemonic: "",
        path: "",
        locale: "",
        privateKey: "",
        publicKey: "",
        address: "",
        balance: 0,
        name: ""
      }
    },
    menu: {
      currentWallet: null,
      display: false,
      deleteConfirmation: { display: false, accept: false }
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
  
  get wallets() {
    return this.rootStore.walletStore.wallets;
  }
  
  createWalletInit() {
    this.walletDialogs.init.display = true;
  }
  
  createWalletTogglePending() {
    this.walletDialogs.pending = !this.walletDialogs.pending;
  }
  
  
  createWalletProceed = async () => {
    this.walletDialogs.pending = true;
    try {
      console.log("CREATE-WALLET");
      const { RNRandomBytes } = NativeModules;
      RNRandomBytes.randomBytes(16, (err, bytes) => {
        console.log(bytes)
        const entropy: Uint8Array = Uint8Array.from(atob(bytes), c => c.charCodeAt(0)); // randomBytes(16)
        console.log("step-1");
        const mnemonic = entropyToMnemonic(entropy, "en");
        console.log("step-2", mnemonic);
        const wallet = ethers.Wallet.fromMnemonic(mnemonic);
        const wallet2 = new ethers.Wallet(entropy)
        console.log(wallet2.privateKey, wallet2.address, wallet2.publicKey)
        console.log("step-3");
        this.walletDialogs.proceed.wallet.mnemonic = wallet.mnemonic.phrase // wallet.mnemonic.phrase;
        this.walletDialogs.proceed.wallet.path = wallet.mnemonic.path;
        this.walletDialogs.proceed.wallet.locale = wallet.mnemonic.locale;
        this.walletDialogs.proceed.wallet.address = wallet.address;
        this.walletDialogs.proceed.wallet.privateKey = wallet.privateKey;
        this.walletDialogs.proceed.wallet.publicKey = wallet.publicKey;
        this.walletDialogs.init.display = false;
        this.walletDialogs.proceed.display = true;
      });
    } catch (e) {
      console.log("ERROR", e);
    }
  };
  
  async saveWallet() {
    runInAction(() => {
      this.walletDialogs.proceed.display = false;
      this.walletDialogs.pending = false;
      this.walletDialogs.init.accept = false;
    });
    try {
      await runInAction(async () => {
        await this.rootStore.walletStore.addWallet(new Wallet(toJS(this.walletDialogs.proceed.wallet)));
      });
    } catch (e) {
      console.log(e);
    }
    
    runInAction(() => {
      this.walletDialogs.pending = false;
    });
  }
  
  async removeWallet() {
    await this.rootStore.walletStore.removeWallet(this.walletDialogs.menu.currentWallet);
    this.closeMenuDialog();
  }
  
  closeMenuDialog() {
    this.walletDialogs.menu.display = false;
    this.walletDialogs.menu.deleteConfirmation.display = false;
  }
}
