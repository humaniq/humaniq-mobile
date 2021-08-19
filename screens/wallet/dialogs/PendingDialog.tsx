import { Colors, Dialog, LoaderScreen, Text, View } from "react-native-ui-lib";
import { runInAction } from "mobx";
import React from "react";
import { useInstance } from "react-ioc";
import { WalletScreenModel } from "../WalletScreenModel";
import { observer } from "mobx-react-lite";

export const PendingDialog = observer(() => {
  const view = useInstance(WalletScreenModel);
  return <Dialog
    ignoreBackgroundPress
    width={ "100%" }
    containerStyle={ { backgroundColor: Colors.grey80 } }
    onDismiss={ () => runInAction(() => view.walletDialogs.pendingDialog.display = false) }
    visible={ view.walletDialogs.pendingDialog.display }
    bottom
  >
    <View>
      <View row paddingV-10 center>
        <View flex right paddingH-20 paddingV-5>
        </View>
      </View>
      { !view.walletDialogs.pending &&
      <View row center marginB-20 padding-50>
        <View >
          <LoaderScreen />
        </View >
        <View>
          <Text marginL-20 text60BO>{ view.walletDialogs.pendingDialog.message }</Text>
        </View>
      </View>
      }
      {
        view.walletDialogs.pending &&
        <View marginH-30 marginV-10 height={ 200 }><LoaderScreen color={ Colors.grey20 } /></View>
      }
    </View>
  </Dialog>;
});
