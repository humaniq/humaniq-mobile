import { makeAutoObservable } from "mobx";
import { RootStore } from "../../../store/RootStore";
import { LOCKER_MODE } from "../../../store/app/AppStore";
import { runUnprotected } from "mobx-keystone";
import * as crypto from "crypto";

export enum REGISTER_STATE {
  MAIN = "MAIN",
  REGISTER = "REGISTER",
  RECOVER = "RECOVER"
}

export class RegisterViewModel {
  initialized = false;
  pending = false;
  state = REGISTER_STATE.MAIN;
  store: RootStore;
  step = 0;
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
  
  goRegister(store) {
    runUnprotected(() => {
      this.store.appStore.isLockerDirty = false;
      this.store.appStore.savedPin = "";
      this.store.appStore.lockerStatus = false;
    });
    this.state = REGISTER_STATE.REGISTER;
    this.init(store);
  }
  
  async init(store?: RootStore) {
    this.pending = true;
    console.log("init-register");
    if (store) {
      this.store = store;
    }
    if (store.appStore.lockerStatus) {
      this.state = REGISTER_STATE.REGISTER;
      console.log(store.appStore.savedPin);
      const algorithm = "aes-256-cbc";

// generate 16 bytes of random data
      const initVector = new Uint8Array(16); // crypto.randomBytes(16);
      const message = "This is a secret message";
      const Securitykey = crypto.randomBytes(32);
      const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
      let encryptedData = cipher.update(message, "utf-8", "hex");
      encryptedData += cipher.final("hex");
      console.log("Encrypted message: " + encryptedData);

// the decipher function
      const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
      
      let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
      
      decryptedData += decipher.final("utf8");
      
      console.log("Decrypted message: " + decryptedData);
      
    }
    if (this.step == 0 && !store.appStore.lockerStatus && !store.appStore.isLockerDirty) {
      runUnprotected(() => {
        store.appStore.lockerMode = LOCKER_MODE.SET;
        store.appStore.isLocked = true;
      });
    }
    if (!store.appStore.lockerStatus && store.appStore.isLockerDirty) {
      this.state = REGISTER_STATE.MAIN;
    }
    this.initialized = true;
    this.pending = false;
  }
}
