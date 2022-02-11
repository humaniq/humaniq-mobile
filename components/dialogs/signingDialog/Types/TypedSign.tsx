import { observer } from "mobx-react-lite"
import { getAppStore, getWalletStore } from "../../../../App"
import React, { useEffect, useState } from "react"
import { runUnprotected } from "mobx-keystone"
import { normalize } from "eth-sig-util"
import { SignBody } from "./SignBody";

export const TypedSign = observer(() => {
    const appStore = getAppStore()

    const [ message, setMessage ] = useState("")

    useEffect(() => {
        setMessage(JSON.stringify(appStore.signMessageParams.data.message ?
            appStore.signMessageParams.data.message :
            appStore.signMessageParams.data))

    }, [ appStore.signMessageParams ])

    const signMessage = async () => {
        try {
            await runUnprotected(async () => {
                const messageParams = appStore.signMessageParams
                const messageId = messageParams.metamaskId
                const version = messageParams.version
                const cleanMessageParams = await appStore.typedMessageManager.approveMessage(messageParams)
                const rawSig = await getWalletStore().keyring.signTypedData(normalize(cleanMessageParams.from), cleanMessageParams.data, { version })
                runUnprotected(() => {
                    appStore.typedMessageManager.setMessageStatusSigned(messageId, rawSig)
                    appStore.signMessageDialogDisplay = false
                })
            })
        } catch (e) {
            console.log("ERROR", e)
            rejectMessage()
        }
    }

    const rejectMessage = () => {
        try {
            runUnprotected(() => {
                const messageParams = appStore.signMessageParams
                const messageId = messageParams.metamaskId
                appStore.typedMessageManager.rejectMessage(messageId)
                appStore.signMessageDialogDisplay = false
            })
        } catch (e) {
            console.log("ERROR", e)
            runUnprotected(() => {
                appStore.signMessageDialogDisplay = false
            })
        }
    }

    return <SignBody
        testID={ 'typedSign' }
        rejectMessage={ rejectMessage }
        signMessage={ signMessage }
        message={ message }
    />
})
