import { Button, Colors, Dialog, LoaderScreen, Text, TextField, View } from "react-native-ui-lib"
import { runInAction } from "mobx"
import React from "react"
import { useInstance } from "react-ioc"
import { observer } from "mobx-react-lite"
import { t } from "../../../i18n"
import { SendWalletTransactionViewModel } from "./SendWalletTransactionViewModel"
import { DialogHeader } from "../dialogHeader/DalogHeader"

export const SendWalletTransactionDialog = observer(() => {
    const view = useInstance(SendWalletTransactionViewModel)

    return <Dialog
            width={ "100%" }
            containerStyle={ { backgroundColor: Colors.grey80, borderTopLeftRadius: 30, borderTopRightRadius: 30 } }
            onDismiss={ () => runInAction(() => view.display = false) }
            visible={ view.display }
            bottom
    >
        <View>
            <DialogHeader onPressIn={ () => view.display = false }/>
            { !view.pending && view.display && !!!view.message &&
            <View marginB-20 padding-10 paddingH-20>
                <TextField floatingPlaceholder placeholder={ t("common.address") } value={ view.txData.to }
                           onChangeText={ (val) => view.txData.to = val }/>
                <TextField floatingPlaceholder placeholder={ t("common.value") } value={ view.txData.value }
                           onChangeText={ (val) => view.txData.value = val }/>
                <Text margin-20 red30>{ view.txError ? t("errors.transactionBodyError") : "" }</Text>
                <Button disabled={ !view.isTransferAllow } onPress={ view.sendTx } label={ t("common.send") }/>
            </View>
            }
            { !view.pending && view.display && !!view.message &&
            <View marginB-40 padding-10 paddingH-40 center>
                <Text text40BO>{ view.message }</Text>
            </View>
            }
            {
                view.pending &&
                <View marginH-30 marginV-10 height={ 200 }><LoaderScreen color={ Colors.grey20 }/></View>
            }
        </View>
    </Dialog>
})