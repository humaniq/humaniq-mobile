import React from "react";
import { observer } from "mobx-react-lite";
import { Card, Colors, Image, Text, Toast, View } from "react-native-ui-lib";
import { useInstance } from "react-ioc";
import { WalletsScreenModel } from "../../../screens/wallets/WalletsScreenModel";
import { t } from "../../../i18n";

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
          <Image source={
            !view.walletDialogs.pendingDialog.walletCreated ?
                require("../../../assets/images/sand-clocks.png") :
                require("../../../assets/images/finger-up.png")
          }/>
          <Text marginL-20 robotoM> { !view.walletDialogs.pendingDialog.walletCreated ?
              t("walletScreen.menuDialog.createWallet.createWalletMessage") :
              t("walletScreen.menuDialog.createWallet.createWalletMessageDone")
          } </Text>
          {/*<View right flex>*/}
          {/*  <Button onPress={() => {*/}
          {/*    */}
          {/*  }} link label={t("common.cancellation")} />*/}
          {/*</View>*/}
        </View>
      </Card>
    </View>
  </Toast>
})