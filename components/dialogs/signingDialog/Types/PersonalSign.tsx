import { observer } from "mobx-react-lite"
import { getAppStore, getWalletStore } from "../../../../App"
import React, { useEffect, useState } from "react"
import { runUnprotected } from "mobx-keystone"
import { normalize } from "eth-sig-util"
import { hexToText } from "@metamask/controllers/dist/util"
import { SignBody } from "./SignBody";

export const PersonalSign = observer(() => {
    const appStore = getAppStore()

    const [ message, setMessage ] = useState("")

    useEffect(() => {
        setMessage(hexToText(appStore.signMessageParams.data))
    }, [ appStore.signMessageParams ])

    const signMessage = async () => {
        await runUnprotected(async () => {
            const messageParams = appStore.signMessageParams
            const messageId = messageParams.metamaskId
            const cleanMessageParams = await appStore.personalMessageManager.approveMessage(messageParams)
            const rawSig = await getWalletStore().keyring.signPersonalMessage(normalize(cleanMessageParams.from), cleanMessageParams.data)
            runUnprotected(() => {
                appStore.personalMessageManager.setMessageStatusSigned(messageId, rawSig)
                appStore.signMessageDialogDisplay = false
            })
        })
    }

    const rejectMessage = () => {
        runUnprotected(() => {
            const messageParams = appStore.signMessageParams
            const messageId = messageParams.metamaskId
            appStore.personalMessageManager.rejectMessage(messageId)
            appStore.signMessageDialogDisplay = false
        })
    }

    return <SignBody
        rejectMessage={ rejectMessage }
        signMessage={ signMessage }
        message={ message }
    />
})
