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
import { getAppStore, getWalletStore } from "../../App"
import * as Keychain from 'react-native-keychain';
import { isEmpty } from "../../utils/general";

export enum AUTH_STATE {
    MAIN = "MAIN",
    REGISTER = "REGISTER",
    RECOVER = "RECOVER",
    LOGIN = "LOGIN"
}

export class AuthViewModel {
    initialized = false
    pending = false
    needLoader = false
    state = AUTH_STATE.MAIN
    step = 0
    navigation: NavigationProp<any>
    isSavedWallet = false
    input = ''

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    onChangeRecoverPhrase(val) {
        runUnprotected(() => {
            this.input = val
            getAppStore().recoverPhrase = val
        })
    }

    get wordsCount() {
        if (isEmpty(this.input)) {
            return 0
        }
        return this.input.trim().split(" ").length
    }

    get isValidRecover() {
        return this.wordsCount === 12
            && bip39.validateMnemonic(this.input)
            && this.input.length <= 74
            && !isEmpty(this.input)
    }

    get isInvalidRecover() {
        return this.wordsCount >= 12 && !this.isValidRecover
    }

    clearWordsCount() {
        this.input = ""
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
            } else if (getAppStore().lockerStatus && getAppStore().lockerPreviousScreen === AUTH_STATE.LOGIN) {
                this.state = AUTH_STATE.LOGIN
                runUnprotected(async () => {
                    getAppStore().appState = APP_STATE.APP
                    getAppStore().lockerPreviousScreen = ""
                })
                await getAppStore().init()
                this.pending = false
                this.initialized = true
            } else if (getAppStore().lockerStatus && getAppStore().lockerPreviousScreen === AUTH_STATE.REGISTER) {
                this.state = AUTH_STATE.REGISTER
                this.pending = true
                this.needLoader = true
                setTimeout(async () => {
                    await this.createWallet()
                    this.pending = false
                    this.initialized = true
                    this.needLoader = false
                }, 1)
            } else if (getAppStore().lockerStatus && getAppStore().lockerPreviousScreen === AUTH_STATE.RECOVER) {
                this.state = AUTH_STATE.RECOVER
                if (getAppStore().recoverPhrase && getAppStore().lockerStatus && getAppStore().savedPin) {
                    this.pending = true
                    this.needLoader = true
                    setTimeout(async () => {
                        await this.createWallet(getAppStore().recoverPhrase)
                        this.initialized = true
                        this.pending = false
                        this.needLoader = false
                    }, 1)
                }
            } else if (!getAppStore().lockerStatus && !getAppStore().isLockerDirty && (
                getAppStore().lockerPreviousScreen === AUTH_STATE.RECOVER ||
                getAppStore().lockerPreviousScreen === AUTH_STATE.REGISTER)) {
                runUnprotected(() => {
                    getAppStore().lockerMode = LOCKER_MODE.SET
                    getAppStore().isLocked = true
                })
                this.pending = false
                this.initialized = true
            } else if (!getAppStore().lockerStatus && !getAppStore().isLockerDirty &&
                getAppStore().lockerPreviousScreen === AUTH_STATE.LOGIN) {
                runUnprotected(() => {
                    getAppStore().lockerMode = LOCKER_MODE.CHECK
                    getAppStore().isLocked = true
                })
                this.pending = false
                this.initialized = true
            } else if (!getAppStore().lockerStatus && getAppStore().isLockerDirty) {
                this.state = AUTH_STATE.MAIN
                this.pending = false
                this.initialized = true
            } else {
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
        await Keychain.setGenericPassword("hm-user", getAppStore().savedPin);
        await localStorage.save("hm-wallet", encoded)
        runUnprotected(async () => {
            getWalletStore().storedWallets = JSON.parse(JSON.stringify(wallet))
            getAppStore().lockerPreviousScreen = ""
            getAppStore().recoverPhrase = ""
            getAppStore().appState = APP_STATE.APP
            await getWalletStore().init(true)
            // getAuthStore().registrationOrLogin(getWalletStore().allWallets[0].address)
        })
        await getAppStore().init()
    }
}