import { observer } from "mobx-react-lite"
import { Button, Colors, Text, View } from "react-native-ui-lib"
import { getAppStore, getWalletStore } from "../../../../App"
import { t } from "../../../../i18n"
import React from "react"
import { runUnprotected } from "mobx-keystone"
import { normalize } from "eth-sig-util"

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
