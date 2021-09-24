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
import { BlurWrapper } from "../../components/blurWrapper/BlurWrapper"

const Wallet = observer(function () {
    const view = useInstance(WalletsScreenModel)
    const walletMenu = useInstance(WalletMenuDialogViewModel)
    const store = useInstance(RootStore)
    const nav = useNavigation()


    useEffect(() => {
        view.init(store)
    }, [])
    return (
            <BlurWrapper
                    before={
                        <Screen backgroundColor={ Colors.dark70 } statusBarBg={ Colors.dark70 }
                                preset="scroll"
                                style={ { height: "100%" } }
                                refreshing={ view.refreshing }
                                onRefresh={ view.onRefresh }
                        >
                            { view.initialized &&
                            <Animatable.View animation={ "fadeIn" } style={ { height: "100%", flex: 1 } }>
                                <View flex>
                                    <Header onPressMenu={ () => view.walletDialogs.menu.display = true }
                                            title={ t("walletScreen.name") }/>
                                    <View flex>
                                        { store.walletStore.allWallets.map((w: W, i) => {
                                            return <Card height={ 100 } margin-10 padding-20 animated
                                                         key={ w.address }
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
                                                            <View row center>
                                                                <View center paddingR-10>
                                                                    <Text text40 dark20
                                                                          bold>{ w.formatBalance }</Text>
                                                                </View>
                                                                { !w.pending && !w.isError &&
                                                                <View center>
                                                                    <Text violet40 text70
                                                                          bold>{ ` ≈${ w.fiatBalance }` }</Text>
                                                                </View>
                                                                }
                                                                { w.pending &&
                                                                <View left padding-10><LoaderScreen/></View> }
                                                                { w.isError && !w.pending &&
                                                                <><FAIcon size={ 16 } name={ "bug" }
                                                                          color={ Colors.red40 }/>
                                                                    <Text red40 text70R marginL-10>Error</Text></>
                                                                }
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View flex-1 center right>
                                                        <Button onPress={ async () => walletMenu.open(w, nav) } round
                                                                backgroundColor={ Colors.violet60 }>
                                                            <FAIcon color={ Colors.primary } name={ "ellipsis-v" }/>
                                                        </Button>
                                                    </View>
                                                </View>
                                            </Card>
                                        }) }
                                    </View>
                                </View>
                            </Animatable.View> }
                            { !view.initialized && <View flex><LoaderScreen/></View> }
                        </Screen>
                    }
                    after={
                        <View absB flex row>
                            <WalletsMenuDialog/>
                            <PendingDialog/>
                            <WalletMenuDialog/>
                        </View>
                    }
                    isBlurActive={
                        view.walletDialogs.pendingDialog.display ||
                        view.walletDialogs.menu.display ||
                        walletMenu.display
                    }
            />
    )
})

export const WalletsScreen = provider()(Wallet)
WalletsScreen.register(WalletsScreenModel, WalletMenuDialogViewModel)
