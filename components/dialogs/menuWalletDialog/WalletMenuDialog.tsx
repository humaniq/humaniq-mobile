import { Colors, Dialog, LoaderScreen, Text, View } from "react-native-ui-lib"
import React from "react"
import { useInstance } from "react-ioc"
import { WalletMenuDialogViewModel } from "./WalletMenuDialogViewModel"
import { observer } from "mobx-react-lite"
import { DialogHeader } from "../dialogHeader/DalogHeader"
import Ripple from "react-native-material-ripple"
import FAIcon from "react-native-vector-icons/FontAwesome5"
import { runInAction } from "mobx"


export const WalletMenuDialog = observer(() => {
    const view = useInstance(WalletMenuDialogViewModel)

    // const sheetRef = React.useRef(null)

    // useEffect(() => {
    //     view.dialog = sheetRef
    // }, [])

    // const renderContent = () => (
    //         <View style={ { height: 300 } } bg-white>
    //             { !view.pending &&
    //             <View flex marginB-20>
    //                 { view.items.map(i => {
    //                     return <Ripple
    //                             key={ i.name }
    //                             rippleColor={ Colors.primary }
    //                             onPress={ i.action }
    //                     >
    //                         <View padding-20 row>
    //                             <FAIcon size={ 20 } color={ Colors.primary } name={ i.icon }/>
    //                             <Text marginL-20 text60R dark20>{ i.name }</Text>
    //                         </View>
    //
    //                     </Ripple>
    //                 }) }
    //             </View>
    //             }
    //             {
    //                 view.pending &&
    //                 <View marginH-30 marginV-10 height={ 200 }><LoaderScreen color={ Colors.grey20 }/></View>
    //             }
    //         </View>
    // )

    return <Dialog
            width={ "100%" }
            containerStyle={ { backgroundColor: Colors.grey80, borderTopLeftRadius: 30, borderTopRightRadius: 30 } }
            onDismiss={ () => runInAction(() => view.display = false) }
            visible={ view.display }
            bottom
    >
        <View>
            <DialogHeader onPressIn={ () => view.display = false }/>
            { !view.pending &&
            <View marginB-20>
                { view.items.map(i => {
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
                view.pending &&
                <View marginH-30 marginV-10 height={ 200 }><LoaderScreen color={ Colors.grey20 }/></View>
            }
        </View>
    </Dialog>
    // return (
    //         <>
    //             <View
    //                     style={ {
    //                         width: "100%"
    //                     } }
    //             >
    //                 <Text>.</Text>
    //             </View>
    //             <BottomSheet
    //                     // springConfig={{
    //                     //     damping: 15,
    //                     //     mass: 1.2,
    //                     //     stiffness: 250,
    //                     //     overshootClamping: false,
    //                     //     restSpeedThreshold: 20,
    //                     //     restDisplacementThreshold: 100}}
    //                     ref={ sheetRef }
    //                     snapPoints={ [ 0, 300 ] }
    //                     borderRadius={ 30 }
    //                     renderContent={ renderContent }
    //             />
    //         </>
    // )
})
