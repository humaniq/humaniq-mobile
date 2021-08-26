import { makeAutoObservable } from "mobx"
import { APP_STATE, LOCKER_MODE } from "../../store/app/AppStore"
import { runUnprotected } from "mobx-keystone"
import "react-native-get-random-values"
import "@ethersproject/shims"
import { t } from "../../i18n"
import { NavigationProp } from "@react-navigation/native"
import { localStorage } from "../../utils/localStorage"
import Cryptr from "react-native-cryptr"
import bip39 from "react-native-bip39"
import { getAppStore, getAuthStore, getWalletStore } from "../../App"

export enum AUTH_STATE {
    MAIN = "MAIN",
    REGISTER = "REGISTER",
    RECOVER = "RECOVER",
    LOGIN = "LOGIN"
}

export class AuthViewModel {
    initialized = false
    pending = false
    state = AUTH_STATE.MAIN
    step = 0
    navigation: NavigationProp<any>
    isSavedWallet = false
    isValidRecover = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    onChangeRecoverPhrase(val) {
        runUnprotected(() => {
            getAppStore().recoverPhrase = val
        })
        this.isValidRecover = bip39.validateMnemonic(getAppStore().recoverPhrase)
        console.log(this.isValidRecover)
    }

    async recoveryWallet() {
        this.initialized = true
        getAppStore().resetLocker(AUTH_STATE.RECOVER)
        await this.init()
    }

    initNavigation(nav) {
        this.navigation = nav
    }

    async goRegister() {
        getAppStore().resetLocker(AUTH_STATE.REGISTER)
        this.initialized = true
        this.state = AUTH_STATE.REGISTER
        await this.init()
    }

    async goRecover() {
        getAppStore().resetLocker(AUTH_STATE.RECOVER)
        this.initialized = true
        this.state = AUTH_STATE.RECOVER
    }

    async goLogin() {
        getAppStore().resetLocker(AUTH_STATE.LOGIN)
        this.initialized = true
        this.state = AUTH_STATE.LOGIN
        await this.init()
    }

    get message() {
        switch (this.state) {
            case AUTH_STATE.MAIN:
                return t("registerScreen.walletCreating")
            case AUTH_STATE.REGISTER:
                return t("registerScreen.walletCreating")
            case AUTH_STATE.RECOVER:
                return t("registerScreen.walletRecoverTitle")
        }
    }

    async init() {
        try {
            this.pending = true
            this.isSavedWallet = !!await localStorage.load("hm-wallet")

            if (this.isSavedWallet &&
              !getAppStore().lockerStatus &&
              !getAppStore().isLockerDirty && this.state === AUTH_STATE.MAIN) {
                runUnprotected(() => {
                    getAppStore().lockerPreviousScreen = AUTH_STATE.LOGIN
                    getAppStore().lockerMode = LOCKER_MODE.CHECK
                    getAppStore().isLocked = true
                })
                this.initialized = true
                this.pending = false
            }

            if (getAppStore().lockerStatus && getAppStore().lockerPreviousScreen === AUTH_STATE.LOGIN) {
                this.state = AUTH_STATE.LOGIN
                runUnprotected(async () => {
                    getAppStore().appState = APP_STATE.APP
                    getAppStore().lockerPreviousScreen = ""
                })
                await getAppStore().init()
                this.pending = false
                this.initialized = true
            }

            if (getAppStore().lockerStatus && getAppStore().lockerPreviousScreen === AUTH_STATE.REGISTER) {
                this.state = AUTH_STATE.REGISTER
                this.pending = true
                setTimeout(async () => {
                    await this.createWallet()
                    this.pending = false
                    this.initialized = true
                }, 1)
            }

            if (getAppStore().lockerStatus && getAppStore().lockerPreviousScreen === AUTH_STATE.RECOVER) {
                this.state = AUTH_STATE.RECOVER
                if (getAppStore().recoverPhrase && getAppStore().lockerStatus && getAppStore().savedPin) {
                    this.pending = true
                    setTimeout(async () => {
                        await this.createWallet(getAppStore().recoverPhrase)
                        this.initialized = true
                        this.pending = false
                    }, 1)
                }
            }

            if (!getAppStore().lockerStatus && !getAppStore().isLockerDirty && (
              getAppStore().lockerPreviousScreen === AUTH_STATE.RECOVER ||
              getAppStore().lockerPreviousScreen === AUTH_STATE.REGISTER)) {
                runUnprotected(() => {
                    getAppStore().lockerMode = LOCKER_MODE.SET
                    getAppStore().isLocked = true
                })
                this.pending = false
                this.initialized = true
            }

            if (!getAppStore().lockerStatus && !getAppStore().isLockerDirty &&
              getAppStore().lockerPreviousScreen === AUTH_STATE.LOGIN) {
                runUnprotected(() => {
                    getAppStore().lockerMode = LOCKER_MODE.CHECK
                    getAppStore().isLocked = true
                })
                this.pending = false
                this.initialized = true
            }
            if (!getAppStore().lockerStatus && getAppStore().isLockerDirty) {
                this.state = AUTH_STATE.MAIN
                this.pending = false
                this.initialized = true
            }
        } catch (e) {
            console.log("ERROR", e)
        }
    }

    async createWallet(phrase?: string) {
        const wallet = await getWalletStore().createWallet(phrase)
        const cryptr = new Cryptr(getAppStore().savedPin)
        const encoded = await cryptr.encrypt(JSON.stringify(wallet))
        await localStorage.save("hm-wallet", encoded)
        runUnprotected(async () => {
            getWalletStore().storedWallets = JSON.parse(JSON.stringify(wallet))
            getAppStore().lockerPreviousScreen = ""
            getAppStore().appState = APP_STATE.APP
            await getWalletStore().init(true)
            getAuthStore().registrationOrLogin(getWalletStore().wallets[0].address)
        })
        await getAppStore().init()
    }
}
