import {
    _await,
    Model,
    model,
    modelAction,
    modelFlow,
    runUnprotected,
    timestampToDateTransform,
    tProp as p,
    types as t
} from "mobx-keystone"
import { AppState } from "react-native"
import { AUTH_STATE } from "../../screens/auth/AuthViewModel"
import { localStorage } from "../../utils/localStorage"
import { getEVMProvider, getProfileStore, getWalletStore } from "../../App"
import 'react-native-get-random-values'
import { MessageManager, PersonalMessageManager, PhishingController, TypedMessageManager } from "@metamask/controllers"
import { TOAST_POSITION } from "../../components/toasts/appToast/AppToast";
import Cryptr from "react-native-cryptr"
import NetInfo from "@react-native-community/netinfo";
import { setConnectionInfo } from "../../utils/toast";
import { SUGGESTION_STEP } from "../profile/ProfileStore";
import { EVM_NETWORKS_NAMES } from "../../config/network";
import { profiler } from "../../utils/profiler/profiler";
import { EVENTS, MARKETING_EVENTS } from "../../config/events";
import { events } from "../../utils/events";

export enum APP_STATE {
    AUTH = "AUTH",
    APP = "APP",
}

export enum LOCKER_MODE {
    SET = "SET",
    CHECK = "CHECK"
}

export enum TOASTER_TYPE {
    SUCCESS = 'SUCCESS',
    PENDING = 'PENDING',
    ERROR = 'ERROR'
}

@model("AppStore")
export class AppStore extends Model({
    lastBackgroundDate: p(t.number).withTransform(timestampToDateTransform()).withSetter(),
    initialized: p(t.boolean, false),
    isConnected: p(t.boolean, true).withSetter(),
    walletPageInitialized: p(t.boolean, false),
    appState: p(t.enum(APP_STATE), APP_STATE.AUTH),
    isLocked: p(t.boolean, false),
    lockerMode: p(t.enum(LOCKER_MODE), LOCKER_MODE.SET),
    lockerStatus: p(t.boolean, false),
    lockerPreviousScreen: p(t.string, ""),
    isLockerDirty: p(t.boolean, false),
    savedPin: p(t.string),
    bioEnabled: p(t.boolean, true),
    recoverPhrase: p(t.string, "").withSetter(),
    storedPin: p(t.string, ""),
    signMessageParams: p(t.unchecked<any>()),
    signType: p(t.string, ""),
    signPageTitle: p(t.string, ""),
    signPageUrl: p(t.string, ""),
    signMessageDialogDisplay: p(t.boolean, false),
    currentRoute: p(t.string, ""),
    toast: p(t.object(() => ({
        display: t.boolean,
        type: t.enum(TOASTER_TYPE),
        message: t.string,
        position: t.enum(TOAST_POSITION)
    })), () => ({
        display: false,
        type: TOASTER_TYPE.PENDING,
        message: "",
        position: TOAST_POSITION.UNDER_TAB_BAR
    })).withSetter()
}) {
    messageManager = new MessageManager()
    personalMessageManager = new PersonalMessageManager()
    typedMessageManager = new TypedMessageManager()
    phishingController = new PhishingController()

    @modelFlow
    * logout() {
        yield* _await(localStorage.clear())
        this.setAppState(APP_STATE.AUTH)
        getWalletStore().storedWallets = null
        yield getProfileStore().setIsSuggested(false)
        yield getProfileStore().setVerified(false)
        // @ts-ignore
        getProfileStore().setFormStep(SUGGESTION_STEP.SUGGESTION)
        getEVMProvider().currentNetworkName = EVM_NETWORKS_NAMES.BSC
        this.storedPin = null
        this.isLockerDirty = true
        this.isLocked = false
    }

    @modelFlow
    * init() {
        if (!this.initialized) {
            const id = profiler.start(EVENTS.INIT_APP_STORE)
            this.storedPin = (yield* _await(localStorage.load("hm-wallet-settings"))) || ""
            if (!this.storedPin) {
                AppState.addEventListener("change", (nextState) => {
                    if (nextState === "background") {
                        // @ts-ignore
                        this.setLastBackgroundDate(new Date())
                    } else if (nextState === "active") {
                        events.send(MARKETING_EVENTS.OPEN_APP)
                        if (!this.lastBackgroundDate || new Date().getTime() - (this.lastBackgroundDate?.getTime() + 15 * 1000) > 0) {
                            this.setAppState(APP_STATE.AUTH)
                            if (getWalletStore().storedWallets) {
                                runUnprotected(() => {
                                    this.lockerPreviousScreen = AUTH_STATE.LOGIN
                                    this.isLocked = true
                                    this.lockerStatus = false
                                    this.lockerMode = LOCKER_MODE.CHECK
                                    this.savedPin = ""
                                })
                            }
                        }
                    } else if (nextState === 'inactive') {
                        events.send(MARKETING_EVENTS.CLOSE_APP)
                    }
                })
            } else {
                this.setPin(this.storedPin)
                this.appState = APP_STATE.APP
                this.isLocked = false
            }
            const enabled = (yield* _await(localStorage.load("hm-wallet-settings-bio")))
            this.bioEnabled = enabled === null ? true : enabled


            this.messageManager.hub.on('unapprovedMessage', messageParams =>
                this.onUnapprovedMessage(messageParams, 'eth')
            )

            this.personalMessageManager.hub.on('unapprovedMessage', messageParams =>
                this.onUnapprovedMessage(messageParams, 'personal')
            )

            this.typedMessageManager.hub.on('unapprovedMessage', messageParams =>
                this.onUnapprovedMessage(messageParams, 'typed')
            )

            NetInfo.addEventListener(state => {
                // @ts-ignore
                if (!this.isConnected && state.isInternetReachable) {
                    setConnectionInfo(true)
                    getWalletStore().updateWalletsInfo();
                }
                // @ts-ignore
                this.setIsConnected(state.isInternetReachable)
            });

            this.initialized = true
            profiler.end(id)
        }
    }

    @modelAction
    onUnapprovedMessage = (messageParams, type) => {
        const { title: currentPageTitle, url: currentPageUrl } = messageParams.meta
        delete messageParams.meta
        this.signMessageParams = messageParams
        this.signType = type
        this.signPageTitle = currentPageTitle
        this.signPageUrl = currentPageUrl
        this.signMessageDialogDisplay = true
    }

    @modelAction
    setAppState(state: APP_STATE) {
        this.appState = state
    }

    @modelAction
    setLocker(bool: boolean) {
        this.lockerStatus = bool
    }

    @modelAction
    closeLocker(lastStatus: APP_STATE) {
        this.appState = lastStatus
    }

    @modelAction
    resetLocker(previousScreen?: AUTH_STATE) {
        this.savedPin = ""
        this.isLockerDirty = false
        this.lockerStatus = false
        if (previousScreen) {
            this.lockerPreviousScreen = previousScreen
        }
    }

    @modelFlow
    * setPin(pin: string) {
        if (this.savedPin && this.savedPin !== pin) {
            const id = profiler.start(EVENTS.LOAD_WALLET_FROM_STORAGE)
            const cryptr = new Cryptr(this.savedPin)
            const encrypted = yield* _await(localStorage.load("hm-wallet"))
            if (encrypted) {
                const result = cryptr.decrypt(encrypted)
                const storedWallets = JSON.parse(result)
                const newCryptr = new Cryptr(pin)
                const encoded = yield* _await(newCryptr.encrypt(JSON.stringify(storedWallets)))
                yield* _await(localStorage.save("hm-wallet", encoded))
                profiler.end(id)
            }
        }
        this.savedPin = pin
    }
}