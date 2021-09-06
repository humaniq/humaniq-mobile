import { observer } from "mobx-react-lite"
import { provider, useInstance } from "react-ioc"
import { BrowserScreenViewModel } from "./BrowserScreenViewModel"
import React, { useEffect, useRef } from "react"
import { Button, Colors, LoaderScreen, View } from "react-native-ui-lib"
import * as Animatable from "react-native-animatable"
import { Header } from "../../components/header/Header"
import { t } from "../../i18n"
import { Screen } from "../../components"
import { SelectWalletDialogViewModel } from "../../components/dialogs/selectWalletDialog/SelectWalletDialogViewModel"
import { BlurWrapper } from "../../components/blurWrapper/BlurWrapper"
import { SelectWalletDialog } from "../../components/dialogs/selectWalletDialog/SelectWalletDialog"
import { getWalletStore } from "../../App"
import { useNavigation } from "@react-navigation/native"
import WebView from "react-native-webview"
import { ApprovalDappConnectDialogViewModel } from "../../components/dialogs/approvalDappConnectDialog/ApprovalDappConnectDialogViewModel"
import { ApprovalDappConnectDialog } from "../../components/dialogs/approvalDappConnectDialog/ApprovalDappConnectDialog"

const Browser = observer(() => {
    const view = useInstance(BrowserScreenViewModel)
    const selectDialog = useInstance(SelectWalletDialogViewModel)
    const nav = useNavigation()
    const webViewRef = useRef()

    useEffect(() => {
        view.init(nav)
    }, [])

    useEffect(() => {
        if(webViewRef.current) {
            view.webviewRef = webViewRef.current
        }
    }, [ webViewRef.current ])


    return <BlurWrapper before={ <Screen backgroundColor={ Colors.dark70 } statusBarBg={ Colors.dark70 }
                                         preset="scroll"
                                         style={ { height: "100%" } }
            // refreshing={ view.refreshing }
            // onRefresh={ view.onRefresh }
    >
        <Animatable.View animation={ "fadeIn" } style={ { height: "100%", flex: 1 } }>
            { view.initialized && <View flex>
                <Header title={ t("browserScreen.name") }/>
                <View flex>
                    <WebView
                            ref={ webViewRef }
                            javaScriptEnabled
                            bounces={ false }
                            localStorageEnabled
                            setSupportMultipleWindows={ false }
                            // onNavigationStateChange={ (state) => console.log("nav-changed", state) }
                            onPermissionRequest={ (req) => console.log("PERM", req) }
                            onMessage={ view.onMessage }
                            // onLoad={ (v) => console.log("loading-started", v) }
                            injectedJavaScriptBeforeContentLoaded={ view.entryScriptWeb3 }
                            source={ { uri: view.initialUrl } }
                    />
                </View>
                <View bg-grey70 paddingT-10 center row width={ '100%' }>
                    <Button onPress={ () => selectDialog.display = true } bg-purple40
                            label={ getWalletStore().selectedWallet.formatAddress.split('...')[1] }/>
                </View>
            </View>
            }
        </Animatable.View>
        { !view.initialized && <LoaderScreen/> }
    </Screen> } after={
        <><SelectWalletDialog/>
        <ApprovalDappConnectDialog />
        </>
    } isBlurActive={ selectDialog.display }/>
})

export const BrowserScreen = provider()(Browser)
BrowserScreen.register(BrowserScreenViewModel, SelectWalletDialogViewModel, ApprovalDappConnectDialogViewModel)
