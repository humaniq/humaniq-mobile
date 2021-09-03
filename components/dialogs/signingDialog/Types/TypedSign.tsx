import { observer } from "mobx-react-lite"
import { Button, Colors, Text, View } from "react-native-ui-lib"
import { getAppStore, getWalletStore } from "../../../../App"
import { t } from "../../../../i18n"
import React from "react"
import { runUnprotected } from "mobx-keystone"
import { normalize } from "eth-sig-util"

export const TypedSign = observer(() => {
    const appStore = getAppStore()

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
            console.log(e)
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
            console.log(e)
            runUnprotected(() => {
                appStore.signMessageDialogDisplay = false
            })
        }
    }


    return <View center>
        <View row center marginB-10>
            <Text primary text60> { t("signatureRequest.title") } </Text>
        </View>
        <View row center padding-10>
            <Text grey30 center
                  text60>{ appStore.signPageTitle || new URL(appStore.signPageUrl).host }</Text>
        </View>
        <View row center paddingT-10>
            <Text purple50 center
                  text80>{ t('signatureRequest.ethSignWarning') }</Text>
        </View>
        <View row center padding-20>
            <Text primary
                  text60>{ t('signatureRequest.signing') }</Text>
        </View>
        <View row spread>
            <Button onPress={ rejectMessage } outline outlineColor={ Colors.purple40 } marginH-10
                    label={ t('common.deny') }/>
            <Button onPress={ signMessage } outline outlineColor={ Colors.green40 } marginH-10
                    label={ t('common.sign') }/>
        </View>
    </View>
})
