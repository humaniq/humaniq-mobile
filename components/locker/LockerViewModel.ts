import { makeAutoObservable, reaction } from "mobx";
import { Vibration } from "react-native";
import { APP_STATE, appStore, LOCKER_MODE } from "../../store/app/AppStore";
import { t } from "../../i18n";
import { RootStore } from "../../store/RootStore";
import { runUnprotected } from "mobx-keystone";
import { localStorage } from "../../utils/localStorage";
import Cryptr from "react-native-cryptr";
import bip39 from "react-native-bip39";
import { getAuthStore } from "../../store/auth/AuthStore"
import { getWalletStore } from "../../store/wallet/WalletStore"

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
  encrypted;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async init(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.encrypted = await localStorage.load("hm-wallet");
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
      const cryptr = new Cryptr(this.pin);
      const result = cryptr.decrypt(this.encrypted);
      let isCorrect = false;
      try {
        const res = JSON.parse(result);
        isCorrect = bip39.validateMnemonic(res["mnemonic"].mnemonic);
      } catch (e) {
        isCorrect = false;
      }

      this.rootStore.appStore.setLocker(isCorrect);
      if (!isCorrect) {
        this.message = t("lockerScreen.incorrectPin");
      } else {
        this.message = t("lockerScreen.correctPin");
        appStore.getDefault().setPin(this.pin);
        this.rootStore.walletStore.storedWallets = JSON.parse(result);
        await this.rootStore.walletStore.init(true);
        getAuthStore().registrationOrLogin(getWalletStore().wallets[0].address)
        this.exit();
      }
    }
    if (this.mode === LOCKER_MODE.SET) {
      if (this.step === 0) {
        this.confirmationPin = this.pin;
        this.step = 1;
      } else if (this.step === 1) {
        if (this.pin === this.confirmationPin) {
          appStore.getDefault().setPin(this.pin);
          this.settledPin = this.pin;
          this.message = t("lockerScreen.correctPin");
          this.disabled = true;
          await this.rootStore.appStore.setLocker(true);
          this.exit();
        } else {
          await this.rootStore.appStore.setLocker(false);
          this.message = t("lockerScreen.pinFormErrorIncorrectConfirmationMessage");
          setTimeout(() => {
            this.message = "";
          }, 1000);
        }
        this.confirmationPin = "";
        this.step = 0;
      }
    }
    this.reset();
  }


  exit() {
    runUnprotected(() => {
      this.rootStore.appStore.isLockerDirty = true;
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
