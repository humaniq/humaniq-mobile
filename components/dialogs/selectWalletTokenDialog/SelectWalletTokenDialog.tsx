import React, { useRef } from "react";
import { useInstance } from "react-ioc";
import { observer } from "mobx-react-lite";
import { Colors, Dialog, Text, View } from "react-native-ui-lib";
import { SelectWalletTokenViewModel } from "./SelectWalletTokenViewModel";
import { runInAction } from "mobx";
import { DialogHeader } from "../dialogHeader/DalogHeader";
import { ScrollView } from "react-native";
import { TokenItem } from "../../tokenItem/TokenItem";
import { t } from "../../../i18n";

export const SelectWalletTokenDialog = observer(() => {
  const view = useInstance(SelectWalletTokenViewModel)
  const scroll = useRef()

  return <Dialog
      width={ "100%" }
      visible={ view.display }
      containerStyle={ { backgroundColor: Colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30 } }
      onDismiss={ () => runInAction(() => {
        view.display = false
      }) }
      bottom
  >
    <View style={ { maxHeight: 350 } }>
      <DialogHeader onPressIn={ () => {
        view.display = false
      } }/>
      <ScrollView ref={ scroll }>
        <View padding-16>
          <Text textM>{ t("selectWalletTokenDialog.title") }</Text>
        </View>
        { view.options.map((i, index) => {
          return <TokenItem key={ index } symbol={ i.symbol } tokenAddress={ i.tokenAddress } logo={ i.logo }
                            name={ i.name }
                            formatBalance={ i.formatBalance } formatFiatBalance={ i.formatFiatBalance }
                            index={ index }
                            onPress={ i.onPress }
          />
        }) }
      </ScrollView>
    </View>
  </Dialog>
})