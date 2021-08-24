import React, { useEffect } from "react"
import { provider, useInstance } from "react-ioc"
import { Card, Colors, LoaderScreen, Text, View } from "react-native-ui-lib"
import { observer } from "mobx-react-lite"
import { Screen } from "../../../components"
import { WalletEtherScreenModel } from "./WalletEtherScreenModel"
import FAIcon from "react-native-vector-icons/FontAwesome5"
import * as Animatable from "react-native-animatable"
import { Header } from "../../../components/header/Header"
import { WalletMenuDialogViewModel } from "../../../components/dialogs/menuWalletDialog/WalletMenuDialogViewModel"
import { WalletMenuDialog } from "../../../components/dialogs/menuWalletDialog/WalletMenuDialog"
import { SendTransactionViewModel } from "../../../components/dialogs/sendTransactionDialog/SendTransactionViewModel"
import { SendTransactionDialog } from "../../../components/dialogs/sendTransactionDialog/SendTransactionDialog"
import { t } from "../../../i18n"
import { SelfAddressQrCodeDialog } from "../../../components/dialogs/selfAddressQrCodeDialog/SelfAddressQrCodeDialog"
import { SelfAddressQrCodeDialogViewModel } from "../../../components/dialogs/selfAddressQrCodeDialog/SelfAddressQrCodeDialogViewModel"
import { BlurWrapper } from "../../../components/blurWrapper/BlurWrapper"


const WalletEther = observer<{ route: any }>(function ({ route }) {
    const view = useInstance(WalletEtherScreenModel)
    const walletMenu = useInstance(WalletMenuDialogViewModel)
    const sendTransactionDialog = useInstance(SendTransactionViewModel)
    const selfAddressQrCodeDialogViewModel = useInstance(SelfAddressQrCodeDialogViewModel)
    
    useEffect(() => {
        view.init(route.params.wallet)
    }, [])
    
    return (
      <BlurWrapper
        before={ <Screen backgroundColor={ Colors.dark70 } statusBarBg={ Colors.dark70 }
                         preset="scroll"
          // refreshing={ view.refreshing }
          // onRefresh={ view.onRefresh }
        >
            <Header title={ view.initialized && view?.wallet?.formatAddress || "" }
                    onPressMenu={ () => walletMenu.open(view.wallet) }
            />
            <Animatable.View animation={ "fadeIn" } style={ { height: "100%", flex: 1 } }>
                { view.initialized &&
                <View>
                  <Card height={ 100 } margin-10 padding-20 animated>
                    <View row flex>
                      <View flex-8>
                        <View row flex>
                          <View>
                            <Text dark40 text80 bold>ETH</Text>
                          </View>
                          <View paddingL-10>
                            <Text dark50 text80>{ view.wallet.formatAddress }</Text>
                          </View>
                        </View>
                        <View flex left>
                            { !view.wallet.pending && !view.wallet.isError &&
                            <View row>
                              <View center>
                                <Text text40 dark20 bold>{ view.wallet.formatBalance }</Text>
                              </View>
                              <View center>
                                <Text dark40 text70>{ ` ≈${ view.wallet.fiatBalance }` }</Text>
                              </View>
                            </View> }
                            { view.wallet.pending && <LoaderScreen/> }
                            { view.wallet.isError && !view.wallet.pending &&
                            <View row center>
                              <FAIcon size={ 16 } name={ "bug" } color={ Colors.red40 }/>
                              <Text red40 text70R marginL-10>Error</Text>
                            </View> }
                        </View>
                      </View>
                      <View flex-1 center right>
                      </View>
                    </View>
                  </Card>
                  <View row>
                    <View row center flex-5>
                      <Card margin-10 flex padding-10 animated center
                            onPress={ () => {
                                sendTransactionDialog.wallet = view.wallet
                                sendTransactionDialog.display = true
                            } }
                      >
                        <View row center>
                          <FAIcon.Button backgroundColor={ Colors.transparent } color={ Colors.grey20 } size={ 16 }
                                         name={ "paper-plane" }>
                          </FAIcon.Button>
                          <Text center bold dark20>{ t("common.send") }</Text>
                        </View>
                      </Card>
                    </View>
                    <View row center flex-5>
                      <Card flex margin-10 padding-10 animated center onPress={ () => {
                          selfAddressQrCodeDialogViewModel.wallet = view.wallet
                          selfAddressQrCodeDialogViewModel.display = true
                      }
                      }>
                        <View row center>
                          <FAIcon.Button backgroundColor={ Colors.transparent } color={ Colors.grey20 } size={ 16 }
                                         name={ "qrcode" }>
                          </FAIcon.Button>
                          <Text center bold dark20>{ t("common.get") }</Text>
                        </View>
                      </Card>
                    </View>
                  </View>
                </View>
                }
            </Animatable.View>
        </Screen> }
        after={
            <View>
                <WalletMenuDialog/>
                <SendTransactionDialog/>
                <SelfAddressQrCodeDialog/>
            </View>
        }
        isBlurActive={ (walletMenu.display ||
          sendTransactionDialog.display ||
          selfAddressQrCodeDialogViewModel.display) }
      />
    )
})

export const WalletEtherScreen = provider()(WalletEther)
WalletEtherScreen.register(
  WalletEtherScreenModel,
  WalletMenuDialogViewModel,
  SendTransactionViewModel,
  SelfAddressQrCodeDialogViewModel
)
