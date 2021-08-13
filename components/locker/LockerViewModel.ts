import { makeAutoObservable, reaction } from "mobx";
import { Vibration } from "react-native";
import { APP_STATE, LOCKER_MODE } from "../../store/app/AppStore";
import { t } from "../../i18n";
import { RootStore } from "../../store/RootStore";
import { runUnprotected } from "mobx-keystone";

export const PIN_LENGHT = 4;

export class LockerViewModel {
  initialized = false;
  lastAppState: APP_STATE;
  pin = "";
  disabled = false;
  settledPin = "";
  confirmationPin = "";
  step = 0;
  message: string;
  rootStore: RootStore;
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
  
  async init(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.settledPin = this.rootStore.appStore.savedPin;
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
        this.message = t("lockerScreen.correctPin");
        this.exit()
      }
    }
    if (this.mode === LOCKER_MODE.SET) {
      if (this.step === 0) {
        this.confirmationPin = this.pin;
        this.step = 1;
      } else if (this.step === 1) {
        if (this.pin === this.confirmationPin) {
          this.rootStore.appStore.setPin(this.pin);
          this.settledPin = this.pin;
          this.message = t("lockerScreen.correctPin");
          this.disabled = true;
          await this.rootStore.appStore.setLocker(true);
          this.exit()
        } else {
          await this.rootStore.appStore.setLocker(false);
          this.message = t("lockerScreen.pinFormErrorIncorrectConfirmationMessage");
          setTimeout(() => {
            this.message = ''
          }, 1000)
        }
        this.confirmationPin = "";
        this.step = 0;
      }
    }
    this.reset();
  }
  
  
  exit() {
    runUnprotected(() => {
      this.rootStore.appStore.isLockerDirty = true
      this.rootStore.appStore.isLocked = false;
    });
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
