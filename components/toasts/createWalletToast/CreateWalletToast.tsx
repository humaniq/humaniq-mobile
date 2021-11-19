import React from "react";
import { observer } from "mobx-react-lite";
import { Avatar, Card, Colors, Text, Toast, View } from "react-native-ui-lib";
import { useInstance } from "react-ioc";
import { WalletsScreenModel } from "../../../screens/wallets/WalletsScreenModel";
import { t } from "../../../i18n";
import { HIcon } from "../../icon";


export const CreateWalletToast = observer(() => {
  const view = useInstance(WalletsScreenModel)
  return <Toast
      // zIndex={ 2147483647 }
      position={ "bottom" }
      visible={ view.walletDialogs.pendingDialog.display }
      backgroundColor={ Colors.transparent }
  >
    <View marginV-16>
      <Card padding-15 marginH-16>
        <View row centerV>
          { !view.walletDialogs.pendingDialog.walletCreated ?
              <Avatar backgroundColor={ Colors.rgba(Colors.warning, 0.07) } size={ 44 }>
                <HIcon name={"clock-arrows"} size={ 22 }  color={ Colors.warning }/></Avatar> :
              <Avatar backgroundColor={ Colors.rgba(Colors.success, 0.07) } size={ 44 }>
                <HIcon name={"done"} size={ 22 } color={ Colors.success }/></Avatar> }
          <Text marginL-20 robotoM> { !view.walletDialogs.pendingDialog.walletCreated ?
              t("walletScreen.menuDialog.createWallet.createWalletMessage") :
              t("walletScreen.menuDialog.createWallet.createWalletMessageDone")
          } </Text>
        </View>
      </Card>
    </View>
  </Toast>
})