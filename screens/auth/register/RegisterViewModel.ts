import { makeAutoObservable, runInAction } from "mobx";
import { APP_STATE, appStore, LOCKER_MODE } from "../../../store/app/AppStore";
import { runUnprotected } from "mobx-keystone";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { t } from "../../../i18n";
import { NavigationProp } from "@react-navigation/native";
import { localStorage } from "../../../utils/localStorage";
import Cryptr from "react-native-cryptr";
import { walletStore } from "../../../store/wallet/WalletStore";

export enum REGISTER_STATE {
  MAIN = "MAIN",
  REGISTER = "REGISTER",
  RECOVER = "RECOVER",
  LOGIN = "LOGIN"
}

export class RegisterViewModel {
  initialized = false;
  pending = false;
  state = REGISTER_STATE.MAIN;
  step = 0;
  navigation: NavigationProp<any>;
  isSavedWallet = false;
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
  
  initNavigation(nav) {
    this.navigation = nav;
  }
  
  async goRegister() {
    runUnprotected(() => {
      appStore.getDefault().isLockerDirty = false;
      appStore.getDefault().savedPin = "";
      appStore.getDefault().lockerStatus = false;
      appStore.getDefault().lockerPreviousScreen = REGISTER_STATE.REGISTER;
    });
    runInAction(() => {
      this.initialized = true;
      this.state = REGISTER_STATE.REGISTER;
    });
    
    await this.init();
  }
  
  async goLogin() {
    runUnprotected(() => {
      appStore.getDefault().isLockerDirty = false;
      appStore.getDefault().savedPin = "";
      appStore.getDefault().lockerStatus = false;
      appStore.getDefault().lockerPreviousScreen = REGISTER_STATE.LOGIN;
    });
    runInAction(() => {
      this.initialized = true;
      this.state = REGISTER_STATE.LOGIN;
    });
    
    await this.init();
  }
  
  get message() {
    switch (this.step) {
      case 0:
        return t("registerScreen.walletCreating");
      case 1:
        return t("registerScreen.walletCreating");
    }
  }
  
  async init() {
    try {
      this.pending = true;
      this.isSavedWallet = !!await localStorage.load("hm-wallet");
      
      if (this.isSavedWallet && !appStore.getDefault().lockerStatus && !appStore.getDefault().isLockerDirty && this.state === REGISTER_STATE.MAIN) {
        
        runUnprotected(() => {
          appStore.getDefault().lockerPreviousScreen = REGISTER_STATE.LOGIN;
          appStore.getDefault().lockerMode = LOCKER_MODE.CHECK;
          appStore.getDefault().isLocked = true;
        });
      }
      
      if (appStore.getDefault().lockerStatus && appStore.getDefault().lockerPreviousScreen === REGISTER_STATE.LOGIN) {
        this.state = REGISTER_STATE.LOGIN;
        runUnprotected(async () => {
          appStore.getDefault().appState = APP_STATE.APP;
          appStore.getDefault().lockerPreviousScreen = "";
        });
        await appStore.getDefault().init();
      }
      
      if (appStore.getDefault().lockerStatus && appStore.getDefault().lockerPreviousScreen === REGISTER_STATE.REGISTER) {
        this.state = REGISTER_STATE.REGISTER;
        runInAction(async () => {
          this.step = 1;
          // const thread = new Thread('./thread.js');
          // thread.postMessage('run');
          // thread.onmessage = (message) => console.log(message);
          const wallet = await walletStore.getDefault().createWallet();
          const cryptr = new Cryptr(appStore.getDefault().savedPin);
          const encoded = await cryptr.encrypt(JSON.stringify(wallet));
          await localStorage.save("hm-wallet", encoded);
          runUnprotected(async () => {
            appStore.getDefault().appState = APP_STATE.APP;
            appStore.getDefault().lockerPreviousScreen = "";
            walletStore.getDefault().storedWallets = JSON.parse(JSON.stringify(wallet));
            walletStore.getDefault().init(true);
          });
          await appStore.getDefault().init();
        });
      }
      if (!appStore.getDefault().lockerStatus && !appStore.getDefault().isLockerDirty &&
        appStore.getDefault().lockerPreviousScreen === REGISTER_STATE.REGISTER) {
        runUnprotected(() => {
          appStore.getDefault().lockerMode = LOCKER_MODE.SET;
          appStore.getDefault().isLocked = true;
        });
      }
      if (!appStore.getDefault().lockerStatus && !appStore.getDefault().isLockerDirty &&
        appStore.getDefault().lockerPreviousScreen === REGISTER_STATE.LOGIN) {
        runUnprotected(() => {
          appStore.getDefault().lockerMode = LOCKER_MODE.CHECK;
          appStore.getDefault().isLocked = true;
        });
      }
      if (!appStore.getDefault().lockerStatus && appStore.getDefault().isLockerDirty) {
        this.state = REGISTER_STATE.MAIN;
      }
      this.initialized = true;
      this.pending = false;
    } catch (e) {
      console.log("ERROR", e);
    }
  }
}
