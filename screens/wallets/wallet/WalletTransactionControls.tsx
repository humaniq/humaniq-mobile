import React from "react";
import { Button, Colors, View } from "react-native-ui-lib";
import { t } from "../../../i18n";
import ArrowLogoTop from "../../../assets/icons/arrow-to-top.svg"
import ArrowLogoBottom from "../../../assets/icons/arrow-to-bottom.svg"
import { Shadow } from "react-native-shadow-2";
import { useInstance } from "react-ioc";
import { SelfAddressQrCodeDialogViewModel } from "../../../components/dialogs/selfAddressQrCodeDialog/SelfAddressQrCodeDialogViewModel";
import { WalletsScreenModel } from "../WalletsScreenModel";
import Ripple from "react-native-material-ripple";
import { RootNavigation } from "../../../navigators";

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
        <Ripple rippleColor={ Colors.primary }
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
                  style={ { backgroundColor: Colors.white } } primary outline marginH-10
                  label={ t("common.send") }
          >
            <ArrowLogoTop height={ 14 } width={ 14 } style={ { color: Colors.primary } }/>
          </Button>
        </Ripple>
      </Shadow>
      <Shadow distance={ 8 } radius={ 15 } startColor={ Colors.rgba(Colors.black, 0.03) }
              containerViewStyle={ { backgroundColor: Colors.white, marginLeft: 20, borderRadius: 15 } }>
        <Ripple rippleColor={ Colors.primary } onPress={ async () => {
          selfAddressQrCodeDialogViewModel.wallet = view.currentWallet
          selfAddressQrCodeDialogViewModel.display = true
        } }>
          <Button br50 outlineColor={ Colors.white }
                  labelStyle={ { fontFamily: "Roboto-Medium", paddingLeft: 10, fontSize: 14 } }
                  style={ { backgroundColor: Colors.white } } primary outline marginH-10
                  label={ t("common.receive") }
          >
            <ArrowLogoBottom height={ 14 } width={ 14 } style={ { color: Colors.primary } }/>
          </Button>
        </Ripple>
      </Shadow>
    </View></View>
}