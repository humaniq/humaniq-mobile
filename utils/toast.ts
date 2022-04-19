import { runUnprotected } from "mobx-keystone";
import { getAppStore } from "../App";
import { TOASTER_TYPE } from "../store/app/AppStore";
import { TOAST_POSITION } from "../components/toasts/appToast/AppToast";
import { t } from "../i18n";


export const setPendingAppToast = (message = "pending", position = TOAST_POSITION.BOTTOM) => {
    runUnprotected(() => {
        getAppStore().toast.type = TOASTER_TYPE.PENDING
        getAppStore().toast.message = message
        getAppStore().toast.display = true
        getAppStore().toast.position = position
    })
}

export const setConnectionInfo = (isConnected) => {
    runUnprotected(() => {
        if (isConnected) {
            getAppStore().toast.type = TOASTER_TYPE.SUCCESS
            getAppStore().toast.message = t("appToasts.connected")
            getAppStore().toast.display = true
            closeToast()
        } else {
            getAppStore().toast.type = TOASTER_TYPE.ERROR
            getAppStore().toast.message = t("appToasts.disconnected")
            getAppStore().toast.display = true
        }
    })
}

export const setToast = (message: string, type = TOASTER_TYPE.SUCCESS, position = TOAST_POSITION.BOTTOM, withtimeout = false) => {
    runUnprotected(() => {
        getAppStore().toast.type = type
        getAppStore().toast.message = message
        getAppStore().toast.display = true
        getAppStore().toast.position = position
    })
    if(withtimeout) {
        setTimeout(() => {
            runUnprotected(() => {
                getAppStore().toast.display = false
            })
        }, 3000)
    }
}

export const closeToast = () => {
    runUnprotected(() => {
        getAppStore().toast.type = TOASTER_TYPE.SUCCESS
    })

    setTimeout(() => {
        runUnprotected(() => {
            getAppStore().toast.display = false
        })
    }, 3000)
}
