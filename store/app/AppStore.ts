import { _await, createContext, Model, model, modelAction, modelFlow, tProp as p, types as t } from "mobx-keystone";
import { providerStore } from "../provider/ProviderStore";
import { walletStore } from "../wallet/WalletStore";
import { localStorage } from "../../utils/localStorage";
import { computed } from "mobx";

export enum APP_STATE {
  AUTH = "AUTH",
  APP = "APP",
  LOCKED = "LOCKED"
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
  lockerMode: p(t.enum(LOCKER_MODE), LOCKER_MODE.CHECK),
  lockerStatus: p(t.boolean, false)
  
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
  
  @computed
  get isLockerActive() {
    return this.appState === APP_STATE.LOCKED;
  }
  
  @modelAction
  setLocker(bool: boolean) {
    this.lockerStatus = bool;
  }
  
  @modelAction
  closeLocker(lastStatus: APP_STATE) {
    this.appState = lastStatus;
  }
}
