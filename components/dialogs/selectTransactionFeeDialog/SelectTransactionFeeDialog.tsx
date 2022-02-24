import React from "react";
import { observer } from "mobx-react-lite";
import { ActionSheet, Avatar, Button, Colors, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { useInstance } from "react-ioc";
import { SelectTransactionFeeDialogViewModel } from "./SelectTransactionFeeDialogViewModel";
import Ripple from "react-native-material-ripple"
import { t } from "../../../i18n";
import { currencyFormat } from "../../../utils/number";
import { getWalletStore } from "../../../App";

export const SelectTransactionFeeDialog = observer(() => {

    const view = useInstance(SelectTransactionFeeDialogViewModel)
    return <ActionSheet
        testID={ 'selectTransactionFeeDialog' }
        visible={ view.display }
        containerStyle={ {
            backgroundColor: Colors.bg,
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
        } }
        optionsStyle={ {
            backgroundColor: Colors.white,
            borderRadius: 12,
            marginLeft: 16,
            marginRight: 16,
            marginBottom: 16
        } }
        dialogStyle={ {
            paddingTop: 20,
            backgroundColor: 'transparent'
        } }
        options={ view.options }
        renderTitle={ () =>
            <>
                <TouchableOpacity>
                    <View row paddingV-2 center>
                        <View flex center paddingH-20 paddingV-5>
                            <Button onPressIn={ () => {
                                view.display = false
                            } } avoidInnerPadding avoidMinWidth
                                    style={ {
                                        marginTop: -16,
                                        padding: 2,
                                        paddingHorizontal: 22,
                                        backgroundColor: Colors.white
                                    } }/>
                        </View>
                    </View>
                </TouchableOpacity>
                <View padding-16>
                    <Text text16 black robotoM>{ t("selectTransactionFeeDialog.name") }</Text>
                    <Text text14 marginT-6 black robotoR
                          color={ Colors.textGrey }>{ t("selectTransactionFeeDialog.description") }</Text>
                </View>
            </>
        }
        renderAction={ (option, index, onOptionPress) => {
            return <Ripple testID={ `action-${ (option.label as any).data }` } onPress={ () => onOptionPress(index) }
                           key={ index }>
                <View paddingH-16 paddingV-10 row width={ '100%' } spread>
                    <View flex-1>
                        <Avatar imageStyle={ { height: 24, width: 24, position: "absolute", left: 10, top: 10 } }
                                backgroundColor={ Colors.greyLight } size={ 44 }
                            // source={ (option.label as any).icon }
                        >
                            { (option.label as any).icon }
                        </Avatar>
                    </View>
                    <View flex-3 paddingL-25 centerV left>
                        <View>
                            <Text black text16 robotoM>{ (option.label as any).name }</Text>
                        </View>
                        <View paddingT-5>
                            <Text text14 robotoR textGrey>{ `< ${ (option.label as any).time } min` }</Text>
                        </View>
                    </View>
                    <View flex-6 centerV right>
                        <View>
                            <Text black text16
                                  robotoM>{ currencyFormat(`${ (option.label as any).feeFiat }`, getWalletStore().currentFiatCurrency) }</Text>
                        </View>
                        <View paddingT-5>
                            <Text text14 robotoR textGrey>{ `${ (option.label as any).fee } ETH` }</Text>
                        </View>
                    </View>
                </View>
                { index !== view.options.length - 1 &&
                    <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 70 } }/> }
            </Ripple>
        } }
        onDismiss={ () => {
            view.display = false
        } }
    />
})