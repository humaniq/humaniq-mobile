import { observer } from "mobx-react-lite"
import { getAppStore, getWalletStore } from "../../../../App"
import React from "react"
import { runUnprotected } from "mobx-keystone"
import { normalize } from "eth-sig-util"
import { SignBody } from "./SignBody";

export const MessageSign = observer(() => {
    const appStore = getAppStore()

    const signMessage = async () => {
        await runUnprotected(async () => {
            const messageParams = appStore.signMessageParams
            const messageId = messageParams.metamaskId
            const cleanMessageParams = await appStore.messageManager.approveMessage(messageParams)
            const rawSig = await getWalletStore().keyring.signMessage(normalize(cleanMessageParams.from), cleanMessageParams.data)
            runUnprotected(() => {
                appStore.messageManager.setMessageStatusSigned(messageId, rawSig)
                appStore.signMessageDialogDisplay = false
            })
        })
    }

    const rejectMessage = () => {
        runUnprotected(() => {
            const messageParams = appStore.signMessageParams
            const messageId = messageParams.metamaskId
            appStore.messageManager.rejectMessage(messageId)
            appStore.signMessageDialogDisplay = false
        })
    }

    return <SignBody
        rejectMessage={ rejectMessage }
        signMessage={ signMessage }/>
})
