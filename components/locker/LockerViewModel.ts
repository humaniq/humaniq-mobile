import { makeAutoObservable, reaction } from "mobx"
import { AppState } from "react-native"
import { LOCKER_MODE } from "../../store/app/AppStore"
import { t } from "../../i18n"
import { runUnprotected } from "mobx-keystone"
import { localStorage } from "../../utils/localStorage"
import Cryptr from "react-native-cryptr"
import bip39 from "react-native-bip39"
import { getAppStore } from "../../App"
import ReactNativeBiometrics from "react-native-biometrics";
import Keychain from "react-native-keychain";
import { RootNavigation } from "../../navigators";
import { events } from "../../utils/events";
import { MARKETING_EVENTS } from "../../config/events";

export const PIN_LENGTH = 4

export class LockerViewModel {
    initialized = false
    pin = ""
    disabled = false
    settledPin = ""
    confirmationPin = ""
    step = 0
    message: string
    encrypted
    incorrectCount = 0
    isBioAvailable = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    async init() {
        this.encrypted = await localStorage.load("hm-wallet")
        this.initialized = true
        const { available } = await ReactNativeBiometrics.isSensorAvailable()
        this.isBioAvailable = available

        AppState.addEventListener("change", async (nextState) => {
            if (nextState === "active" && this.mode === LOCKER_MODE.CHECK && getAppStore().isLocked && getAppStore().bioEnabled) {
                setTimeout(async () => {
                    await this.checkBio()
                })
            }
        })
        getAppStore().bioEnabled && await this.checkBio()
    }

    async checkBio() {
        if (!this.isFingerprintEnabled) return
        try {
            const result = await ReactNativeBiometrics.simplePrompt({
                promptMessage: t("lockerScreen.fingerprint"),
                cancelButtonText: t('common.cancel')
            })
            if (!result.success) return
            const cr = await Keychain.getGenericPassword()
            if (cr) {
                getAppStore().setLocker(true)
                getAppStore().setPin(cr.password)
                this.done()
            }
        } catch (e) {
            console.log("input pin code")
        }
    }

    handleClick(digit) {
        this.pin += digit
    }

    removeDigit() {
        this.pin = this.pin.substring(0, this.pin.length - 1);
    }

    get mode() {
        return getAppStore().lockerMode
    }

    get isChangingPin() {
        return getAppStore().lockerPreviousScreen === "settings"
    }

    get isFingerprintEnabled() {
        return this.isBioAvailable && this.mode === LOCKER_MODE.CHECK
    }

    async validatePin() {
        if (this.mode === LOCKER_MODE.CHECK) {
            let isCorrect = false
            if (this.encrypted) {
                const cryptr = new Cryptr(this.pin)
                const result = cryptr.decrypt(this.encrypted)
                try {
                    const res = JSON.parse(result)
                    isCorrect = bip39.validateMnemonic(res.mnemonic.mnemonic)
                } catch (e) {
                    isCorrect = false
                }
            } else {
                isCorrect = false
            }

            getAppStore().setLocker(isCorrect)
            if (!isCorrect) {
                this.incorrectCount++
                if (this.incorrectCount > 2) this.exit()
                this.message = t("lockerScreen.incorrectPin")
                this.disabled = true
                setTimeout(() => {
                    this.message = ""
                    this.disabled = false
                }, 1000 * this.incorrectCount)
            } else {
                getAppStore().setPin(this.pin)
                this.done()
            }
        } else if (this.mode === LOCKER_MODE.SET) {
            if (this.step === 0) {
                this.confirmationPin = this.pin
                this.step = 1
                this.disabled = false
            } else if (this.step === 1) {
                if (this.pin === this.confirmationPin) {
                    getAppStore().setPin(this.pin)
                    this.settledPin = this.pin
                    this.message = t("lockerScreen.correctPin")
                    this.disabled = true
                    await getAppStore().setLocker(true)
                    this.done()
                    this.disabled = false
                } else {
                    await getAppStore().setLocker(false)
                    this.message = t("lockerScreen.pinFormErrorIncorrectConfirmationMessage")
                    setTimeout(() => {
                        this.message = ""
                    }, 1000)
                }
                this.confirmationPin = ""
                this.step = 0
                this.disabled = false
            }
        }
        this.reset()
    }

    done() {
        runUnprotected(() => {
            events.send(MARKETING_EVENTS.ENTER_PIN_CODE)
            if (getAppStore().lockerPreviousScreen === "settings" && this.step === 0) {
                this.pin = ""
                this.disabled = false
                getAppStore().lockerMode = LOCKER_MODE.SET
            } else if (getAppStore().lockerPreviousScreen === "settings" && this.step === 1) {
                this.step = 0
                this.exit()
            } else if (getAppStore().lockerPreviousScreen === "recovery") {
                this.exit()
                setTimeout(() => {
                    RootNavigation.navigate("recoveryPhrase")
                }, 10)

            } else {
                this.exit()
            }
        })
    }

    exit() {
        runUnprotected(() => {
            getAppStore().isLockerDirty = true
            getAppStore().isLocked = false
        })
        this.step = 0
    }

    reset() {
        this.pin = ""
    }

    watchPin = reaction(() => this.pin, async (val) => {
        if (val && val.length === PIN_LENGTH) {
            this.disabled = true
            await this.validatePin()
        }
    })
}