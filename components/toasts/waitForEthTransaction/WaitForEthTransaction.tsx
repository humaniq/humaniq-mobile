import React from "react"
import { observer } from "mobx-react-lite"
import { Button, Colors, LoaderScreen, Text, Toast, TouchableOpacity, View } from "react-native-ui-lib"
import { useInstance } from "react-ioc"
import { WaitForEthTransactionViewModel } from "./WaitForEthTransactionViewModel"
import FAIcon from "react-native-vector-icons/FontAwesome5"
import { t } from "../../../i18n"

export const WaitForEthTransaction = observer(() => {
    const view = useInstance(WaitForEthTransactionViewModel)
    return <Toast
            zIndex={ 2147483647 }
            backgroundColor={ Colors.violet30 }
            position={ "bottom" }
            visible={ view.display }
    >
        <TouchableOpacity onPress={ view.navToTransaction }>
            <View padding-20>
                <View row centerV>
                    <Text text50 white marginR-10>{ view.transactionActionName }</Text>
                    <Button style={ { height: 35, width: 35 } } round backgroundColor={ Colors.violet10 }>
                        <FAIcon color={ Colors.white } size={ 14 } name={ "list-alt" }
                                onPress={ view.navToTransaction }/>
                    </Button>

                </View>
                { view.display &&
                <View row spread paddingT-20>
                    <View flex-8>
                        {
                            view.canRewriteTransaction && view.process !== 'done'
                            && <View row>
                                <Button onPress={ view.cancelTransaction } backgroundColor={ Colors.purple40 }
                                        label={ view.process !== "cancel" && t('common.cancellation') }>
                                    { view.process === "cancel" && <LoaderScreen color={ Colors.white }/> }
                                </Button>
                                <Button onPress={ view.speedUpTransaction } marginL-20
                                        backgroundColor={ Colors.violet10 }
                                        label={ view.process !== "speedUp" && `${t("common.speedUp")} 1.5x` }>
                                    { view.process === "speedUp" && <LoaderScreen color={ Colors.white }/> }
                                </Button>
                            </View>
                        }
                        {
                            view.process === 'done' && <View row>
                                <Button onPress={ () => view.transaction = null } marginL-20
                                        backgroundColor={ Colors.violet10 }
                                        label={ t('common.cancel') }>
                                </Button>
                            </View>
                        }
                        {
                            !view.canRewriteTransaction && view.process !== 'done' &&
                            <View row>
                                <Text white>{ t('sendTransactionDialog.cantRewriteTransaction') }</Text>
                            </View>
                        }
                    </View>
                    <View flex-2 center>
                        { view.process === "pending" && <LoaderScreen color={ Colors.white }/> }
                    </View>
                </View>
                }
            </View>
        </TouchableOpacity>
    </Toast>
})
