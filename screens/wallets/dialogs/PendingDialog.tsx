import { Colors, Dialog, LoaderScreen, Text, View } from "react-native-ui-lib"
import { runInAction } from "mobx"
import React from "react"
import { useInstance } from "react-ioc"
import { WalletsScreenModel } from "../WalletsScreenModel"
import { observer } from "mobx-react-lite"
import { DialogHeader } from "../../../components/dialogs/dialogHeader/DalogHeader"

export const PendingDialog = observer(() => {
    const view = useInstance(WalletsScreenModel)
    return <Dialog
            ignoreBackgroundPress
            width={ "100%" }
            containerStyle={ { backgroundColor: Colors.grey80, borderTopLeftRadius: 30, borderTopRightRadius: 30 } }
            onDismiss={ () => runInAction(() => view.walletDialogs.pendingDialog.display = false) }
            visible={ view.walletDialogs.pendingDialog.display }
            bottom
    >
        <View>
            <DialogHeader onPressIn={ () => view.walletDialogs.pendingDialog.display = false }/>
            { !view.walletDialogs.pending &&
            <View row center marginB-20 padding-50>
                <View>
                    <LoaderScreen/>
                </View>
                <View>
                    <Text marginL-20 text60BO>{ view.walletDialogs.pendingDialog.message }</Text>
                </View>
            </View>
            }
            {
                view.walletDialogs.pending &&
                <View marginH-30 marginV-10 height={ 200 }><LoaderScreen color={ Colors.grey20 }/></View>
            }
        </View>
    </Dialog>
})
