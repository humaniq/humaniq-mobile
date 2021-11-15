import React from "react";
import { Colors, View } from "react-native-ui-lib";
import { Wallet } from "../../../store/wallet/Wallet";
import { getWalletStore } from "../../../App";

export const WalletTabs = ({ index }) => {
  const allWallets: Wallet [] = getWalletStore().allWallets
  return <View>
    <View row flex spread paddingH-20>
      {
        allWallets.map((w, i) => (<View key={ i } height={ 2 } flex
                                        style={ index === i ? {
                                          backgroundColor: Colors.grey10,
                                          borderRadius: 1
                                        } : {
                                          backgroundColor: Colors.grey80,
                                          borderRadius: 1
                                        } }/>))
      }
    </View>
  </View>
}