import { makeAutoObservable, reaction } from "mobx";
import { Vibration } from "react-native";
import { APP_STATE, LOCKER_MODE } from "../../store/app/AppStore";
import { localStorage } from "../../utils/localStorage";
import { t } from "../../i18n";
import { RootStore } from "../../store/RootStore";
import { inject } from "react-ioc";

export const PIN_LENGHT = 4;

export class LockerViewModel {
  initialized = false;
  lastAppMode: APP_STATE;
  pin = "";
  disabled = false;
  settledPin = "";
  confirmationPin = "";
  step = 0;
  message = "";
  rootStore: RootStore;
  
  constructor() {
    makeAutoObservable(this);
  }
  
  async init(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.settledPin = this.mode === LOCKER_MODE.CHECK ? await localStorage.load("password") : "";
    this.lastAppMode = this.rootStore.appStore.appState as APP_STATE;
    this.initialized = true;
  }
  
  handleClick(digit) {
    Vibration.vibrate(100);
    this.pin += digit;
  }
  
  get mode() {
    return this.rootStore.appStore.lockerMode;
  }
  
  async validatePin() {
    if (this.mode === LOCKER_MODE.CHECK) {
      this.rootStore.appStore.setLocker(this.pin === this.settledPin);
      if (this.pin !== this.settledPin) {
        this.message = t("lockerScreen.incorrectPin");
      } else {
        this.rootStore.appStore.getDefault().closeLocker(this.lastAppMode);
      }
    }
    if (this.mode === LOCKER_MODE.SET) {
      if (this.step === 0) {
        this.confirmationPin = this.pin;
        this.step = 1;
      } else if (this.step === 1) {
        if (this.pin === this.confirmationPin) {
          await localStorage.save("pincode", this.pin);
          this.settledPin = this.pin;
          await this.rootStore.appStore.setLocker(true);
        } else {
          await this.rootStore.appStore.getDefault().setLocker(false);
          this.message = t("lockerScreen.pinFormErrorIncorrectConfirmationMessage");
        }
        this.confirmationPin = "";
        this.step = 0;
      }
    }
    this.reset();
  }
  
  reset() {
    this.pin = "";
    this.disabled = false;
  }
  
  watchPin = reaction(() => this.pin, async (val) => {
    if (val && val.length === PIN_LENGHT) {
      this.disabled = true;
      await this.validatePin();
    }
  });
}
