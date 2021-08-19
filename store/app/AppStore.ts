import {
  _await,
  createContext, getSnapshot,
  Model,
  model,
  modelAction,
  modelFlow,
  runUnprotected,
  tProp as p,
  types as t
} from "mobx-keystone";
import { AppState } from "react-native";
import { AUTH_STATE } from "../../screens/auth/AuthViewModel";
import { getWalletStore, walletStore } from "../wallet/WalletStore";
import { reaction } from "mobx";
import { localStorage } from "../../utils/localStorage";
import Cryptr from "react-native-cryptr";
import bip39 from "react-native-bip39";

export enum APP_STATE {
  AUTH = "AUTH",
  APP = "APP",
}

export enum LOCKER_MODE {
  SET = "SET",
  CHECK = "CHECK"
}


export const appStore = createContext<AppStore>();

@model("AppStore")
export class AppStore extends Model({
  initialized: p(t.boolean, false),
  appState: p(t.enum(APP_STATE), __DEV__? APP_STATE.APP : APP_STATE.AUTH),
  isLocked: p(t.boolean, false),
  lockerMode: p(t.enum(LOCKER_MODE), LOCKER_MODE.SET),
  lockerStatus: p(t.boolean, false),
  lockerPreviousScreen: p(t.string, ""),
  isLockerDirty: p(t.boolean, false),
  savedPin: p(t.string),
  recoverPhrase: p(t.string, "").withSetter()
}) {
  
  @modelFlow
  * init() {
    if (!this.initialized) {
      appStore.setDefault(this);
      if (!__DEV__) {
        AppState.addEventListener("change", (nextState) => {
          if (nextState === "background") {
            this.setAppState(APP_STATE.AUTH);
            if (walletStore.getDefault().storedWallets) {
              runUnprotected(() => {
                this.lockerPreviousScreen = AUTH_STATE.LOGIN;
                this.isLocked = true;
                this.lockerStatus = false;
                this.lockerMode = LOCKER_MODE.CHECK;
                this.savedPin = "";
              });
            }
          }
        });
      } else {
        this.isLocked = false
        this.setPin("1234")
        const encypted = yield* _await(localStorage.load("hm-wallet"));
        const cryptr = new Cryptr(this.savedPin);
        const result = cryptr.decrypt(encypted);
        const res = JSON.parse(result);
        const isCorrect = bip39.validateMnemonic(res["mnemonic"].mnemonic);
        if(isCorrect) {
          getWalletStore().storedWallets = JSON.parse(result);
          yield getWalletStore().init(true);
        }
      }
      reaction(() => getSnapshot(this.isLocked), (value) => {
        if (value) {
          getWalletStore().storedWallets = null;
        }
      });
      this.initialized = true;
    }
  }
  
  @modelAction
  setAppState(state: APP_STATE) {
    this.appState = state;
  }
  
  @modelAction
  setLocker(bool: boolean) {
    this.lockerStatus = bool;
  }
  
  @modelAction
  closeLocker(lastStatus: APP_STATE) {
    this.appState = lastStatus;
  }
  
  @modelAction
  resetLocker(previousScreen?: AUTH_STATE) {
    this.savedPin = "";
    this.isLockerDirty = false;
    this.lockerStatus = false;
    if (previousScreen) {
      this.lockerPreviousScreen = previousScreen;
    }
  }
  
  @modelAction
  setPin(pin: string) {
    this.savedPin = pin;
  }
}
