import { Button, Colors, Dialog, LoaderScreen, Text, View } from "react-native-ui-lib"
import React from "react"
import { useInstance } from "react-ioc"
import { observer } from "mobx-react-lite"
import { DialogHeader } from "../dialogHeader/DalogHeader"
import { ApprovalDappConnectDialogViewModel } from "./ApprovalDappConnectDialogViewModel"
import { t } from "../../../i18n"
import { getWalletStore } from "../../../App"

export const ApprovalDappConnectDialog = observer(() => {
    const view = useInstance(ApprovalDappConnectDialogViewModel)

    return <Dialog
            ignoreBackgroundPress
            width={ "100%" }
            containerStyle={ { backgroundColor: Colors.grey80, borderTopLeftRadius: 30, borderTopRightRadius: 30 } }
            visible={ view.display }
            bottom
    >
        <View>
            <DialogHeader onPressIn={ () => view.display = false }/>
            { !view.pending &&
            <View center padding-20>
                <View row center>
                    <Text primary
                          text60> { view.hostName } </Text>
                </View>
                <View row center>
                    <Text primary
                          text60>{ t('approvalDappConnectDialog.wontToConnect') }</Text>
                </View>
                <View row center>
                    <Text primary text60>
                        { getWalletStore().selectedWallet.formatAddress }
                    </Text>
                </View>
                <View row center paddingV-20>
                    <Text center grey30 text80>{ t('approvalDappConnectDialog.attention') }</Text>
                </View>
                <View row spread>
                    <Button onPress={ view.onAccountsRejected } outline outlineColor={ Colors.purple40 } marginH-10
                            label={ t('common.deny') }/>
                    <Button onPress={ view.onAccountsConfirm } outline outlineColor={ Colors.green40 } marginH-10
                            label={ t('common.allow') }/>
                </View>

            </View>
            }
            {
                view.pending &&
                <View marginH-30 marginV-10 height={ 200 }><LoaderScreen color={ Colors.grey20 }/></View>
            }
        </View>
    </Dialog>
})
