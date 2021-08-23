import { makeAutoObservable } from "mobx";
import { APP_STATE, appStore, LOCKER_MODE } from "../../store/app/AppStore";
import { runUnprotected } from "mobx-keystone";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { t } from "../../i18n";
import { NavigationProp } from "@react-navigation/native";
import { localStorage } from "../../utils/localStorage";
import Cryptr from "react-native-cryptr";
import { walletStore } from "../../store/wallet/WalletStore";
import bip39 from "react-native-bip39";

export enum AUTH_STATE {
  MAIN = "MAIN",
  REGISTER = "REGISTER",
  RECOVER = "RECOVER",
  LOGIN = "LOGIN"
}

export class AuthViewModel {
  initialized = false;
  pending = false;
  state = AUTH_STATE.MAIN;
  step = 0;
  navigation: NavigationProp<any>;
  isSavedWallet = false;
  isValidRecover = false;
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
  
  onChangeRecoverPhrase(val) {
    runUnprotected(() => {
      appStore.getDefault().recoverPhrase = val;
    });
    this.isValidRecover = bip39.validateMnemonic(appStore.getDefault().recoverPhrase);
    console.log(this.isValidRecover);
  }
  
  async recoveryWallet() {
    this.initialized = true;
    appStore.getDefault().resetLocker(AUTH_STATE.RECOVER);
    await this.init();
  }
  
  initNavigation(nav) {
    this.navigation = nav;
  }
  
  async goRegister() {
    appStore.getDefault().resetLocker(AUTH_STATE.REGISTER);
    this.initialized = true;
    this.state = AUTH_STATE.REGISTER;
    await this.init();
  }
  
  async goRecover() {
    appStore.getDefault().resetLocker(AUTH_STATE.RECOVER);
    this.initialized = true;
    this.state = AUTH_STATE.RECOVER;
  }
  
  async goLogin() {
    appStore.getDefault().resetLocker(AUTH_STATE.LOGIN);
    this.initialized = true;
    this.state = AUTH_STATE.LOGIN;
    await this.init();
  }
  
  get message() {
    switch (this.state) {
      case AUTH_STATE.MAIN:
        return t("registerScreen.walletCreating");
      case AUTH_STATE.REGISTER:
        return t("registerScreen.walletCreating");
      case AUTH_STATE.RECOVER:
        return t("registerScreen.walletRecoverTitle");
    }
  }
  
  async init() {
    try {
      this.pending = true;
      this.isSavedWallet = !!await localStorage.load("hm-wallet");
      
      if (this.isSavedWallet &&
        !appStore.getDefault().lockerStatus &&
        !appStore.getDefault().isLockerDirty && this.state === AUTH_STATE.MAIN) {
        runUnprotected(() => {
          appStore.getDefault().lockerPreviousScreen = AUTH_STATE.LOGIN;
          appStore.getDefault().lockerMode = LOCKER_MODE.CHECK;
          appStore.getDefault().isLocked = true;
        });
      }
      
      if (appStore.getDefault().lockerStatus && appStore.getDefault().lockerPreviousScreen === AUTH_STATE.LOGIN) {
        this.state = AUTH_STATE.LOGIN;
        runUnprotected(async () => {
          appStore.getDefault().appState = APP_STATE.APP;
          appStore.getDefault().lockerPreviousScreen = "";
        });
        await appStore.getDefault().init();
      }
      
      if (appStore.getDefault().lockerStatus && appStore.getDefault().lockerPreviousScreen === AUTH_STATE.REGISTER) {
        this.state = AUTH_STATE.REGISTER;
        await this.createWallet();
        await this.auth();
      }
      
      if (appStore.getDefault().lockerStatus && appStore.getDefault().lockerPreviousScreen === AUTH_STATE.RECOVER) {
        this.state = AUTH_STATE.RECOVER;
        if (appStore.getDefault().recoverPhrase && appStore.getDefault().lockerStatus && appStore.getDefault().savedPin) {
          this.createWallet(appStore.getDefault().recoverPhrase).then(() => {
            // this.auth(walletStore.getDefault().wallets[0])
          });
        }
      }
      
      if (!appStore.getDefault().lockerStatus && !appStore.getDefault().isLockerDirty &&
        appStore.getDefault().lockerPreviousScreen === AUTH_STATE.RECOVER) {
        runUnprotected(() => {
          appStore.getDefault().lockerMode = LOCKER_MODE.SET;
          appStore.getDefault().isLocked = true;
        });
      }
      
      if (!appStore.getDefault().lockerStatus && !appStore.getDefault().isLockerDirty &&
        appStore.getDefault().lockerPreviousScreen === AUTH_STATE.REGISTER) {
        runUnprotected(() => {
          appStore.getDefault().lockerMode = LOCKER_MODE.SET;
          appStore.getDefault().isLocked = true;
        });
      }
      if (!appStore.getDefault().lockerStatus && !appStore.getDefault().isLockerDirty &&
        appStore.getDefault().lockerPreviousScreen === AUTH_STATE.LOGIN) {
        runUnprotected(() => {
          appStore.getDefault().lockerMode = LOCKER_MODE.CHECK;
          appStore.getDefault().isLocked = true;
        });
      }
      if (!appStore.getDefault().lockerStatus && appStore.getDefault().isLockerDirty) {
        this.state = AUTH_STATE.MAIN;
      }
      this.initialized = true;
      this.pending = false;
    } catch (e) {
      console.log("ERROR", e);
    }
  }
  
  async createWallet(phrase?: string) {
    const wallet = await walletStore.getDefault().createWallet(phrase);
    const cryptr = new Cryptr(appStore.getDefault().savedPin);
    const encoded = await cryptr.encrypt(JSON.stringify(wallet));
    await localStorage.save("hm-wallet", encoded);
    runUnprotected(async () => {
      walletStore.getDefault().storedWallets = JSON.parse(JSON.stringify(wallet));
      appStore.getDefault().lockerPreviousScreen = "";
      appStore.getDefault().appState = APP_STATE.APP;
      walletStore.getDefault().init(true);
    });
    await appStore.getDefault().init();
  }

  async auth() {
    // auth token
  }
}
