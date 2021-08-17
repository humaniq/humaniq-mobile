import {
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
import { REGISTER_STATE } from "../../screens/auth/register/RegisterViewModel";
import { walletStore } from "../wallet/WalletStore";
import { reaction } from "mobx";

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
  appState: p(t.enum(APP_STATE), APP_STATE.AUTH),
  isLocked: p(t.boolean, false),
  lockerMode: p(t.enum(LOCKER_MODE), LOCKER_MODE.SET),
  lockerStatus: p(t.boolean, false),
  lockerPreviousScreen: p(t.string, ""),
  isLockerDirty: p(t.boolean, false),
  savedPin: p(t.string)
}) {
  
  @modelFlow
  * init() {
    if(!this.initialized) {
      appStore.setDefault(this);
      AppState.addEventListener("change", (nextState) => {
        if (nextState === "background") {
          this.setAppState(APP_STATE.AUTH);
          if (walletStore.getDefault().storedWallets) {
            runUnprotected(() => {
              this.lockerPreviousScreen = REGISTER_STATE.LOGIN;
              this.isLocked = true;
              this.lockerStatus = false;
              this.lockerMode = LOCKER_MODE.CHECK;
              this.savedPin = "";
            });
          }
        }
      });
      reaction(() => getSnapshot(this.isLocked), (value) => {
        if(value) {
          walletStore.getDefault().storedWallets = null
        }
      })
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
  setPin(pin: string) {
    this.savedPin = pin;
  }
}
