import { Colors, Text, View } from "react-native-ui-lib";
import React from "react";
import Ripple from "react-native-material-ripple";
import { getWalletStore } from "../../App";

export const TransactionItem = ({ item, index, onPress }) => {
    return <Ripple testID={ 'transactionItem' } rippleColor={ Colors.primary }
                   onPress={ onPress }
    >
        <View backgroundColor={ Colors.white } key={ item.key }>
            <View row spread padding-8 paddingH-16>
                <View center flex-1>
                    {
                        item.statusIcon
                    }
                </View>
                <View flex-6 paddingL-15>
                    <View>
                        <Text numberOfLines={ 1 } black text16 robotoR>{ item.title }</Text>
                    </View>
                    <View paddingT-5>
                        <Text textGrey text14 robotoR>{ item.formatDate }</Text>
                    </View>
                </View>
                <View right centerV flex-3>
                    <View>
                        <Text numberOfLines={ 1 } black text16 robotoR
                              color={ item.valueColor }>{ getWalletStore().fiatOnTop ? item.formatFiatValue : item.formatValue }</Text>
                    </View>
                    <View paddingT-5>
                        <Text textGrey text14 robotoR >
                            { getWalletStore().fiatOnTop ? item.formatValue : item.formatFiatValue }
                        </Text>
                    </View>
                </View>
            </View>
            {/* eslint-disable-next-line react-native/no-color-literals */ }
            { index !== 0 && <View absR style={ {
                borderWidth: 1,
                borderColor: Colors.grey,
                width: "83%",
                borderBottomColor: "transparent"
            } }/> }
        </View>
    </Ripple>
}