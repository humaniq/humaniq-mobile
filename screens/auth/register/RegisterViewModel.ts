import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from "../../../store/RootStore";
import { APP_STATE, appStore, LOCKER_MODE } from "../../../store/app/AppStore";
import { runUnprotected } from "mobx-keystone";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { t } from "../../../i18n";
import { NavigationProp } from "@react-navigation/native";
import { localStorage } from "../../../utils/localStorage";
import Cryptr from "react-native-cryptr";

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
  store: RootStore;
  step = 0;
  navigation: NavigationProp<any>;
  isSavedWallet = false;
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
  
  initNavigation(nav) {
    this.navigation = nav;
  }
  
  async goRegister(store) {
    runUnprotected(() => {
      store.appStore.isLockerDirty = false;
      store.appStore.savedPin = "";
      store.appStore.lockerStatus = false;
      store.appStore.lockerPreviousScreen = REGISTER_STATE.REGISTER;
    });
    runInAction(() => {
      this.initialized = true;
      this.state = REGISTER_STATE.REGISTER;
    });
    
    await this.init(store);
  }
  
  async goLogin(store) {
    runUnprotected(() => {
      store.appStore.isLockerDirty = false;
      store.appStore.savedPin = "";
      store.appStore.lockerStatus = false;
      store.appStore.lockerPreviousScreen = REGISTER_STATE.LOGIN;
    });
    runInAction(() => {
      this.initialized = true;
      this.state = REGISTER_STATE.LOGIN;
    });
    
    await this.init(store);
  }
  
  get message() {
    switch (this.step) {
      case 0:
        return t("registerScreen.walletCreating");
      case 1:
        return t("registerScreen.walletCreating");
    }
  }
  
  async init(store?: RootStore) {
    try {
      
      console.log("FFDDFD", appStore.getDefault())
      
      this.pending = true;
      console.log("init-register");
      console.log(this.state, appStore.getDefault().lockerPreviousScreen);
      
      if (store) {
        this.store = store;
      }
      
      this.isSavedWallet = !!await localStorage.load("hm-wallet");
      
      if (this.isSavedWallet && !store.appStore.lockerStatus && !store.appStore.isLockerDirty && this.state === REGISTER_STATE.MAIN) {
        console.log('LOGIN')
        runUnprotected(() => {
          store.appStore.lockerPreviousScreen = REGISTER_STATE.LOGIN;
          store.appStore.lockerMode = LOCKER_MODE.CHECK;
          store.appStore.isLocked = true;
        });
      }
      
      if (store.appStore.lockerStatus && store.appStore.lockerPreviousScreen === REGISTER_STATE.LOGIN) {
        this.state = REGISTER_STATE.LOGIN;
        runUnprotected(async () => {
          this.store.appStore.appState = APP_STATE.APP;
          this.store.appStore.lockerPreviousScreen = "";
        });
        await this.store.appStore.init();
      }
      
      if (store.appStore.lockerStatus && store.appStore.lockerPreviousScreen === REGISTER_STATE.REGISTER) {
        this.state = REGISTER_STATE.REGISTER;
        runInAction(async () => {
          this.step = 1;
          // const thread = new Thread('./thread.js');
          // thread.postMessage('run');
          // thread.onmessage = (message) => console.log(message);
          const wallet = await this.store.walletStore.createWallet();
          const cryptr = new Cryptr(store.appStore.savedPin);
          const encryptedString = await cryptr.encrypt(JSON.stringify([ wallet ]));
          await localStorage.save("hm-wallet", encryptedString);
          runUnprotected(async () => {
            this.store.appStore.appState = APP_STATE.APP;
            await this.store.appStore.init();
            this.store.appStore.lockerPreviousScreen = "";
          });
        });
      }
      if (!store.appStore.lockerStatus && !store.appStore.isLockerDirty &&
        store.appStore.lockerPreviousScreen === REGISTER_STATE.REGISTER) {
        console.log('go-to-register', store.appStore.lockerPreviousScreen)
        runUnprotected(() => {
          store.appStore.lockerMode = LOCKER_MODE.SET;
          store.appStore.isLocked = true;
        });
      }
      if (!store.appStore.lockerStatus && !store.appStore.isLockerDirty &&
        store.appStore.lockerPreviousScreen === REGISTER_STATE.LOGIN) {
        console.log('go-to-login', store.appStore.lockerPreviousScreen)
        runUnprotected(() => {
          store.appStore.lockerMode = LOCKER_MODE.CHECK;
          store.appStore.isLocked = true;
        });
      }
      if (!store.appStore.lockerStatus && store.appStore.isLockerDirty) {
        this.state = REGISTER_STATE.MAIN;
      }
      this.initialized = true;
      this.pending = false;
    } catch (e) {
      console.log("ERROR", e);
    }
  }
}
