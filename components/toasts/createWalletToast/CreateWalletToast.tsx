import React from "react";
import { observer } from "mobx-react-lite";
import { Avatar, Card, Colors, Text, Toast, View } from "react-native-ui-lib";
import { useInstance } from "react-ioc";
import { WalletsScreenModel } from "../../../screens/wallets/WalletsScreenModel";
import { t } from "../../../i18n";
import { HIcon } from "../../icon";
import { TOAST_POSITION } from "../appToast/AppToast";


export const CreateWalletToast = observer(() => {
  const view = useInstance(WalletsScreenModel)
  return <Toast
      // zIndex={ 2147483647 }
      position={ "bottom" }
      visible={ view.walletDialogs.pendingDialog.display }
      backgroundColor={ Colors.transparent }
  >
    <View marginV-16>
      <Card padding-15 marginH-16
            style={ { marginVertical: view.walletDialogs.pendingDialog.position === TOAST_POSITION.UNDER_TAB_BAR ? 60 : 5 } }
      >
        <View row centerV>
          { !view.walletDialogs.pendingDialog.walletCreated ?
              <Avatar backgroundColor={ Colors.rgba(Colors.warning, 0.07) } size={ 32 }>
                <HIcon name={ "clock-arrows" } size={ 18 } color={ Colors.warning }/></Avatar> :
              <Avatar backgroundColor={ Colors.rgba(Colors.success, 0.07) } size={ 32 }>
                <HIcon name={ "done" } size={ 19 } color={ Colors.success }/></Avatar> }
          <Text marginL-8 robotoR> { !view.walletDialogs.pendingDialog.walletCreated ?
              t("walletScreen.menuDialog.createWallet.createWalletMessage") :
              t("walletScreen.menuDialog.createWallet.createWalletMessageDone")
          } </Text>
        </View>
      </Card>
    </View>
  </Toast>
})