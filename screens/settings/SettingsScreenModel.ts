import { makeAutoObservable } from "mobx"
import { localStorage } from "../../utils/localStorage"
import { runUnprotected } from "mobx-keystone"
import { getAppStore } from "../../App"

export class SettingsScreenModel {

  initialized = false
  recoveryRead = false

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    this.init()
  }

  get isAllInitialized() {
    return this.initialized
  }

  get settingsMenu() {
    const settings = []

    if (__DEV__ && getAppStore().savedPin) {
      settings.push({
        id: 99,
        type: "toggle",
        name: "Отключить пинкод",
        currentValue: !!getAppStore().storedPin,
        icon: "lock",
        onPress: (val?: boolean) => {
          console.log(getAppStore().storedPin)
          runUnprotected(() => {
            getAppStore().storedPin = val ? getAppStore().savedPin : false
          })
          localStorage.save("hm-wallet-settings", getAppStore().storedPin)
        }
      })
    }

    return settings
  }

  async init() {
    this.initialized = true
    this.recoveryRead = (await localStorage.load("hm-wallet-recovery-read")) || false
  }
}
