import { Colors, Text, View } from "react-native-ui-lib";
import React from "react";
import Ripple from "react-native-material-ripple";

export const TransactionItem = ({ item, index, onPress }) => {
  return <Ripple rippleColor={ Colors.primary }
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
            <Text numberOfLines={ 1 } text70 robotoM>{ item.title }</Text>
          </View>
          <View>
            <Text
                dark50>{ item.formatDate }</Text>
          </View>
        </View>
        <View right centerV flex-3>
          <View>
            <Text numberOfLines={ 1 } text70 dark30 robotoM>{ item.formatFiatValue }</Text>
          </View>
          <View>
            <Text dark50 color={ item.actionColor }>
              { item.actionName }
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