import React, { useEffect } from "react"
import { provider, useInstance } from "react-ioc"
import { Card, Colors, LoaderScreen, Text, View } from "react-native-ui-lib"
import { observer } from "mobx-react-lite"
import { Screen } from "../../../components"
import { WalletEtherScreenModel } from "./WalletEtherScreenModel"
import FAIcon from "react-native-vector-icons/FontAwesome5"
import { Header } from "../../../components/header/Header"
import { WalletMenuDialogViewModel } from "../../../components/dialogs/menuWalletDialog/WalletMenuDialogViewModel"
import { WalletMenuDialog } from "../../../components/dialogs/menuWalletDialog/WalletMenuDialog"
import { SendWalletTransactionViewModel } from "../../../components/dialogs/sendWalletTransactionDialog/SendWalletTransactionViewModel"
import { t } from "../../../i18n"
import { SelfAddressQrCodeDialog } from "../../../components/dialogs/selfAddressQrCodeDialog/SelfAddressQrCodeDialog"
import { SelfAddressQrCodeDialogViewModel } from "../../../components/dialogs/selfAddressQrCodeDialog/SelfAddressQrCodeDialogViewModel"
import { BlurWrapper } from "../../../components/blurWrapper/BlurWrapper"
import { useNavigation } from "@react-navigation/native"
import { TokenItem } from "../../../components/tokenItem/TokenItem";
import { beautifyNumber } from "../../../utils/number";


const WalletEther = observer<{ route: any }>(function ({ route }) {
  const view = useInstance(WalletEtherScreenModel)
  const walletMenu = useInstance(WalletMenuDialogViewModel)
  const sendTransactionDialog = useInstance(SendWalletTransactionViewModel)
  const selfAddressQrCodeDialogViewModel = useInstance(SelfAddressQrCodeDialogViewModel)
  const nav = useNavigation()

  useEffect(() => {
    view.init(route.params.wallet)
  }, [])

  return (
      <BlurWrapper
          before={ <Screen backgroundColor={ Colors.dark70 } statusBarBg={ Colors.dark70 }
                           preset="scroll"
                           refreshing={ view.refreshing }
                           onRefresh={ view.onRefresh }
          >
            <Header title={ view.initialized && view?.wallet?.formatAddress || "" }
                    onPressMenu={ () => walletMenu.open(view.wallet, nav) }
            />
            { view.initialized &&
            <View flex>
                <Card height={ 100 } margin-10 padding-20 animated
                      onPress={ () => nav.navigate("mainStack", {
                        screen: "wallet",
                        params: {
                          screen: "wallet-eth-transactions",
                          params: {
                            wallet: route.params.wallet,
                            symbol: 'ETH'
                          }
                        }
                      }) }
                >
                    <View row flex>
                        <View flex-8>
                            <View row flex>
                                <View>
                                    <Text dark50 text80>{ view.wallet.formatAddress }</Text>
                                </View>
                            </View>
                            <View flex left>
                              { !view.wallet.pending && !view.wallet.isError &&
                              <View row>
                                  <View center>
                                      <Text text40 dark20 bold>{ view.wallet.formatTotalWalletFiatBalance }</Text>
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
                              onPress={ async () => {
                                sendTransactionDialog.wallet = view.wallet
                                await sendTransactionDialog.init()
                              } }
                        >
                            <View row center>
                                <FAIcon.Button backgroundColor={ Colors.transparent }
                                               color={ Colors.violet30 } size={ 16 }
                                               name={ "paper-plane" }>
                                </FAIcon.Button>
                                <Text center bold violet30>{ t("common.send") }</Text>
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
                                <FAIcon.Button backgroundColor={ Colors.transparent }
                                               color={ Colors.violet30 } size={ 16 }
                                               name={ "qrcode" }>
                                </FAIcon.Button>
                                <Text center bold violet30>{ t("common.get") }</Text>
                            </View>
                        </Card>
                    </View>
                </View>
                <Card marginH-10 bg-white marginV-10>
                    <TokenItem
                        onPress={ () => nav.navigate("mainStack", {
                          screen: "wallet",
                          params: {
                            screen: "wallet-eth-transactions",
                            params: {
                              wallet: route.params.wallet,
                              symbol: 'ETH'
                            }
                          }
                        }) }
                        symbol={ "ETH" }
                        tokenAddress={ view.wallet.address }
                        logo={ "ethereum" }
                        name={ "Ethereum" }
                        formatBalance={ beautifyNumber(+view.wallet.formatBalance) }
                        formatFiatBalance={ view.wallet.formatFiatBalance }
                    />
                  {
                    view.wallet.erc20List.length > 0 && view.wallet.erc20List.map(p => {
                      return <TokenItem key={ p.tokenAddress } tokenAddress={ p.tokenAddress } symbol={ p.symbol }
                                        formatBalance={ p.formatBalance } formatFiatBalance={ p.formatFiatBalance }
                                        logo={ p.logo } name={ p.name } onPress={
                        () => nav.navigate("mainStack", {
                          screen: "wallet",
                          params: {
                            screen: "wallet-eth-transactions",
                            params: {
                              wallet: route.params.wallet,
                              symbol: p.symbol,
                              tokenAddress: p.tokenAddress
                            }
                          }
                        })
                      }/>
                    })
                  }
                </Card>
            </View>
            }
          </Screen> }
          after={
            <View>
              <WalletMenuDialog/>
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
    SelfAddressQrCodeDialogViewModel
)
