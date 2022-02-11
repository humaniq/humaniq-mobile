import React from "react";
import { useInstance } from "react-ioc";
import { observer } from "mobx-react-lite";
import { FlatList } from "react-native";
import { Colors, Dialog, Text, View } from "react-native-ui-lib";
import { SelectWalletTokenViewModel } from "./SelectWalletTokenViewModel";
import { runInAction } from "mobx";
import { DialogHeader } from "../dialogHeader/DalogHeader";
import { TokenItem } from "../../tokenItem/TokenItem";
import { t } from "../../../i18n";

export const SelectWalletTokenDialog = observer(() => {
  const view = useInstance(SelectWalletTokenViewModel)

  return <Dialog
      testID={'selectWalletTokenDialog'}
      width={ "100%" }
      height={ 350 }
      visible={ view.display }
      containerStyle={ { backgroundColor: Colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 16 } }
      onDismiss={ () => runInAction(() => {
        view.display = false
      }) }
      bottom
  >

    <DialogHeader onPressIn={ () => {
      view.display = false
    } }/>
    <View padding-16>
      <Text textM>{ t("selectWalletTokenDialog.title") }</Text>
    </View>
    <FlatList
        data={ view.options }
        keyExtractor={ (item) => item.symbol }
        renderItem={ ({ item, index }) => {
          return <TokenItem key={ index } symbol={ item.symbol } tokenAddress={ item.tokenAddress }
                            logo={ item.logo }
                            name={ item.name }
                            formatBalance={ item.formatBalance } formatFiatBalance={ item.formatFiatBalance }
                            index={ index }
                            onPress={ item.onPress }
          />
        }
        }
    />
  </Dialog>
})