import React from "react";
import { Button, Colors, View } from "react-native-ui-lib";
import { t } from "../../../i18n";
import { useInstance } from "react-ioc";
import { SelfAddressQrCodeDialogViewModel } from "../../../components/dialogs/selfAddressQrCodeDialog/SelfAddressQrCodeDialogViewModel";
import { WalletsScreenModel } from "../WalletsScreenModel";
import Ripple from "react-native-material-ripple";
import { RootNavigation } from "../../../navigators";
import { HIcon } from "../../../components/icon"

export interface IWalletTransactionControlsProps {
  tokenAddress?: string
}

export const WalletTransactionControls = (props: IWalletTransactionControlsProps) => {
  const view = useInstance(WalletsScreenModel)
  const selfAddressQrCodeDialogViewModel = useInstance(SelfAddressQrCodeDialogViewModel)

  return <View paddingV-20 paddingH-16>
    <View row center flex>
      <Ripple style={ { flex: 0.5 } } rippleColor={ Colors.primary }
              onPress={ () => {
                RootNavigation.navigate("sendTransaction", {
                  screen: "selectAddress",
                  params: {
                    walletAddress: view.currentWallet.address,
                    tokenAddress: props.tokenAddress
                  }
                })
              } }
      >
        <Button br50 outlineColor={ Colors.white }
                labelStyle={ { fontFamily: "Roboto-Medium", paddingLeft: 10, fontSize: 14 } }
                style={ { backgroundColor: Colors.white } } primary outline marginR-8
                label={ t("common.send") }
        >
          <HIcon name="arrow-to-top" size={ 14 } color={ Colors.primary }/>
        </Button>
      </Ripple>

      <Ripple style={ { flex: 0.5 } } rippleColor={ Colors.primary } onPress={ async () => {
        selfAddressQrCodeDialogViewModel.wallet = view.currentWallet
        selfAddressQrCodeDialogViewModel.display = true
      } }>
        <Button br50 outlineColor={ Colors.white }
                labelStyle={ { fontFamily: "Roboto-Medium", paddingLeft: 10, fontSize: 14 } }
                style={ { backgroundColor: Colors.white } } primary outline marginL-8
                label={ t("common.receive") }
        >
          <HIcon name="arrow-to-bottom" size={ 14 } color={ Colors.primary }/>
        </Button>
      </Ripple>
    </View></View>
}