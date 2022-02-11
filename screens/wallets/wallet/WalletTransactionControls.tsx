import React from "react";
import { Button, Colors, View } from "react-native-ui-lib";
import { t } from "../../../i18n";
import { Shadow } from "react-native-shadow-2";
import { useInstance } from "react-ioc";
import {
  SelfAddressQrCodeDialogViewModel
} from "../../../components/dialogs/selfAddressQrCodeDialog/SelfAddressQrCodeDialogViewModel";
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

  return <View padding-20>
    <View row center>
      <Shadow distance={ 8 } radius={ 15 } startColor={ Colors.rgba(Colors.black, 0.03) }
              containerViewStyle={ { backgroundColor: Colors.white, borderRadius: 15 } }>
        <Ripple
            testID={ `sendTransaction-${props.tokenAddress || 'eth'}` }
            rippleColor={ Colors.primary }
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
                  style={ { backgroundColor: Colors.white, minWidth: 120 } } primary outline marginH-10
                  label={ t("common.send") }
          >
            <HIcon name="arrow-to-top" size={ 14 } color={ Colors.primary }/>
          </Button>
        </Ripple>
      </Shadow>
      <Shadow distance={ 8 } radius={ 15 } startColor={ Colors.rgba(Colors.black, 0.03) }
              containerViewStyle={ { backgroundColor: Colors.white, marginLeft: 20, borderRadius: 15 } }>
          <Ripple testID={ `selfAddressQrCode-${ view.currentWallet.address }` } rippleColor={ Colors.primary } onPress={ async () => {
          selfAddressQrCodeDialogViewModel.wallet = view.currentWallet
          selfAddressQrCodeDialogViewModel.display = true
        } }>
          <Button br50 outlineColor={ Colors.white }
                  labelStyle={ { fontFamily: "Roboto-Medium", paddingLeft: 10, fontSize: 14 } }
                  style={ { backgroundColor: Colors.white, minWidth: 120 } } primary outline marginH-10
                  label={ t("common.receive") }
          >
            <HIcon name="arrow-to-bottom" size={ 14 } color={ Colors.primary }/>
          </Button>
        </Ripple>
      </Shadow>
    </View></View>
}