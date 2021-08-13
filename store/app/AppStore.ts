import { _await, createContext, Model, model, modelAction, modelFlow, tProp as p, types as t } from "mobx-keystone";
import { providerStore } from "../provider/ProviderStore";
import { walletStore } from "../wallet/WalletStore";
import { localStorage } from "../../utils/localStorage";

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
  isLockerDirty: p(t.boolean, false),
  savedPin: p(t.string)
}) {
  @modelFlow
  * init() {
    const isFirstAppStart = !(yield* _await(localStorage.load("humaniq-app")));
    console.log(isFirstAppStart);
    if (isFirstAppStart) {
    
    } else {
      yield providerStore.getDefault().init();
      yield walletStore.getDefault().init();
    }
    this.initialized = true;
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
