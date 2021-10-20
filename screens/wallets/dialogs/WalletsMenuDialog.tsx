import { Colors, Dialog, LoaderScreen, Text, View } from "react-native-ui-lib"
import { runInAction } from "mobx"
import React from "react"
import { useInstance } from "react-ioc"
import { WalletsScreenModel } from "../WalletsScreenModel"
import { observer } from "mobx-react-lite"
import FAIcon from "react-native-vector-icons/FontAwesome5"
import Ripple from "react-native-material-ripple"
import { DialogHeader } from "../../../components/dialogs/dialogHeader/DalogHeader"

export const WalletsMenuDialog = observer(() => {
    const view = useInstance(WalletsScreenModel)
    return <Dialog
            width={ "100%" }
            containerStyle={ { backgroundColor: Colors.grey80, borderTopLeftRadius: 30, borderTopRightRadius: 30 } }
            onDismiss={ () => runInAction(() => view.walletDialogs.menu.display = false) }
            visible={ view.walletDialogs.menu.display }
            bottom
    >
        <View>
            <DialogHeader onPressIn={ () => view.walletDialogs.menu.display = false }/>
            { !view.walletDialogs.pending &&
            <View marginB-20>
                { view.walletDialogs.menu.items.map(i => {
                    return <Ripple
                            key={ i.name }
                            rippleColor={ Colors.primary }
                            onPress={ i.action }
                    >

                        <View padding-20 row>
                            <FAIcon size={ 20 } color={ Colors.primary } name={ i.icon }/>
                            <Text marginL-20 text60R dark20>{ i.name }</Text>
                        </View>

                    </Ripple>
                }) }
            </View>
            }
            {
                view.walletDialogs.pending &&
                <View marginH-30 marginV-10 height={ 200 }><LoaderScreen color={ Colors.grey20 }/></View>
            }
        </View>
    </Dialog>
})
