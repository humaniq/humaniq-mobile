import { _await, Model, model, modelAction, modelFlow, runUnprotected, tProp as p, types as t } from "mobx-keystone"
import { AppState } from "react-native"
import { AUTH_STATE } from "../../screens/auth/AuthViewModel"
import { localStorage } from "../../utils/localStorage"
import { getWalletStore } from "../../App"
import 'react-native-get-random-values'
import { MessageManager, PersonalMessageManager, TypedMessageManager } from "@metamask/controllers"

export enum APP_STATE {
    AUTH = "AUTH",
    APP = "APP",
}

export enum LOCKER_MODE {
    SET = "SET",
    CHECK = "CHECK"
}


@model("AppStore")
export class AppStore extends Model({
    initialized: p(t.boolean, false),
    appState: p(t.enum(APP_STATE), APP_STATE.AUTH),
    isLocked: p(t.boolean, false),
    lockerMode: p(t.enum(LOCKER_MODE), LOCKER_MODE.SET),
    lockerStatus: p(t.boolean, false),
    lockerPreviousScreen: p(t.string, ""),
    isLockerDirty: p(t.boolean, false),
    savedPin: p(t.string),
    recoverPhrase: p(t.string, "").withSetter(),
    storedPin: p(t.string, ""),
    signMessageParams: p(t.unchecked<any>()),
    signType: p(t.string, ""),
    signPageTitle: p(t.string, ""),
    signPageUrl: p(t.string, ""),
    signMessageDialogDisplay: p(t.boolean, false)
}) {

    messageManager = new MessageManager()
    personalMessageManager = new PersonalMessageManager()
    typedMessageManager = new TypedMessageManager()

    @modelFlow
    * init() {

        if (!this.initialized) {
            this.storedPin = (yield* _await(localStorage.load("hm-wallet-settings"))) || ""
            if (!this.storedPin) {
                AppState.addEventListener("change", (nextState) => {
                    if (nextState === "background") {
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
                })
            } else {
                this.setPin(this.storedPin)
                this.appState = APP_STATE.APP
                this.isLocked = false
            }

            this.messageManager.hub.on('unapprovedMessage', messageParams =>
              this.onUnapprovedMessage(messageParams, 'eth')
            )

            this.personalMessageManager.hub.on('unapprovedMessage', messageParams =>
              this.onUnapprovedMessage(messageParams, 'personal')
            )

            this.typedMessageManager.hub.on('unapprovedMessage', messageParams =>
              this.onUnapprovedMessage(messageParams, 'typed')
            )

            this.initialized = true
        }
    }

    @modelAction
    onUnapprovedMessage = (messageParams, type) => {
        console.log("On-unaproved-message", messageParams, type)
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

    @modelAction
    setPin(pin: string) {
        this.savedPin = pin
    }
}
