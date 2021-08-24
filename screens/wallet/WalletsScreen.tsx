import React, { useEffect } from "react"
import { provider, useInstance } from "react-ioc"
import { Button, Card, Colors, LoaderScreen, Text, View } from "react-native-ui-lib"
import { observer } from "mobx-react-lite"
import { Screen } from "../../components"
import { WalletsScreenModel } from "./WalletsScreenModel"
import FAIcon from "react-native-vector-icons/FontAwesome5"
import { useNavigation } from "@react-navigation/native"
import { RootStore } from "../../store/RootStore"
import * as Animatable from "react-native-animatable"
import { t } from "../../i18n"
import { Header } from "../../components/header/Header"
import { Wallet as W } from "../../store/wallet/Wallet"
import { WalletsMenuDialog } from "./dialogs/WalletsMenuDialog"
import { PendingDialog } from "./dialogs/PendingDialog"
import { WalletMenuDialogViewModel } from "../../components/dialogs/menuWalletDialog/WalletMenuDialogViewModel"
import { WalletMenuDialog } from "../../components/dialogs/menuWalletDialog/WalletMenuDialog"
import { getAuthStore } from "../../store/auth/AuthStore"
import { getWalletStore } from "../../store/wallet/WalletStore"

const Wallet = observer(function () {
    const view = useInstance(WalletsScreenModel)
    const walletMenu = useInstance(WalletMenuDialogViewModel)
    const store = useInstance(RootStore)
    const nav = useNavigation()
    
    
    useEffect(() => {
        view.init(store)
    }, [])
    return (
      <Screen backgroundColor={ Colors.dark70 } statusBarBg={ Colors.dark70 }
              preset="scroll"
              refreshing={ view.refreshing }
              onRefresh={ view.onRefresh }
      >
          <Animatable.View animation={ "fadeIn" } style={ { height: "100%", flex: 1 } }>
              { view.initialized && <View flex>
                <Header onPressMenu={ () => view.walletDialogs.menu.display = true } title={ t("walletScreen.name") }/>
                <Button label={ "DDDD" } onPress={ async () => {
                    const wallet = getWalletStore().wallets[0]
                    const result= await getAuthStore().registration(wallet.address)
                    console.log(result)
                }
                }/>
                <View flex>
                    { store.walletStore.wallets.map((w: W) => {
                        return <Card height={ 100 } margin-10 padding-20 animated key={ w.address }
                                     onPress={ () => nav.navigate("mainStack", {
                                         screen: "wallet",
                                         params: {
                                             screen: "wallet-eth",
                                             params: {
                                                 wallet: w.address
                                             }
                                         }
                                     }) }>
                            <View row flex>
                                <View flex-8>
                                    <View row flex>
                                        <View>
                                            <Text dark40 text80 bold>ETH</Text>
                                        </View>
                                        <View paddingL-10>
                                            <Text dark50 text80>{ w.formatAddress }</Text>
                                        </View>
                                    </View>
                                    <View flex left>
                                        { !w.pending && !w.isError &&
                                        <View row>
                                          <View center>
                                            <Text text40 dark20 bold>{ w.formatBalance }</Text>
                                          </View>
                                          <View center>
                                            <Text dark40 text70>{ ` ≈${ w.fiatBalance }` }</Text>
                                          </View>
                                        </View> }
                                        { w.pending && <LoaderScreen/> }
                                        { w.isError && !w.pending &&
                                        <View row center>
                                          <FAIcon size={ 16 } name={ "bug" } color={ Colors.red40 }/>
                                          <Text red40 text70R marginL-10>Error</Text>
                                        </View> }
                                    </View>
                                </View>
                                <View flex-1 center right>
                                    <Button onPress={ () => walletMenu.open(w) } round
                                            backgroundColor={ Colors.grey60 }>
                                        <FAIcon name={ "ellipsis-v" }/>
                                    </Button>
                                </View>
                            </View>
                        </Card>
                    }) }
                </View>
              </View>
              }
          </Animatable.View>
          { !view.initialized && <LoaderScreen/> }
          <WalletsMenuDialog/>
          <WalletMenuDialog/>
          <PendingDialog/>
      </Screen>
    )
})

export const WalletsScreen = provider()(Wallet)
WalletsScreen.register(WalletsScreenModel, WalletMenuDialogViewModel)
