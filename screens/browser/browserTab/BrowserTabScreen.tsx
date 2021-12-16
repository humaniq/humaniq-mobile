import { observer } from "mobx-react-lite"
import { provider, useInstance } from "react-ioc"
import { BrowserTabScreenViewModel } from "./BrowserTabScreenViewModel"
import React, { useEffect, useRef } from "react"
import { Button, Colors, LoaderScreen, ProgressBar, View } from "react-native-ui-lib"
import * as Animatable from "react-native-animatable"
import { Screen } from "../../../components"
import { SelectWalletDialogViewModel } from "../../../components/dialogs/selectWalletDialog/SelectWalletDialogViewModel"
import { BlurWrapper } from "../../../components/blurWrapper/BlurWrapper"
import { SelectWalletDialog } from "../../../components/dialogs/selectWalletDialog/SelectWalletDialog"
import { getWalletStore } from "../../../App"
import { useNavigation } from "@react-navigation/native"
import WebView from "react-native-webview"
import {
  ApprovalDappConnectDialogViewModel
} from "../../../components/dialogs/approvalDappConnectDialog/ApprovalDappConnectDialogViewModel"
import { ApprovalDappConnectDialog } from "../../../components/dialogs/approvalDappConnectDialog/ApprovalDappConnectDialog"
import { BrowserHeader } from "../../../components/browserHeader/BrowserHeader"
import Ripple from "react-native-material-ripple"
import { ExploreModalViewModel } from "../ExploreModalViewModel"
import { ExploreModal } from "../ExploreModal"
import { HIcon } from "../../../components/icon"

const BrowserTab = observer(() => {
  const view = useInstance(BrowserTabScreenViewModel)
  const exploreModal = useInstance(ExploreModalViewModel)
  const selectDialog = useInstance(SelectWalletDialogViewModel)
  const nav = useNavigation()
  const webViewRef = useRef()

  useEffect(() => {
    view.init(nav)
  }, [])

  useEffect(() => {
    if (webViewRef.current) {
      view.webviewRef = webViewRef.current
    }
  }, [ webViewRef.current ])


  return <BlurWrapper before={ <Screen backgroundColor={ Colors.grey70 } statusBarBg={ Colors.grey70 }
                                       preset="scroll"
                                       style={ { height: "100%" } }
      // refreshing={ view.refreshing }
      // onRefresh={ view.onRefresh }
  >
    { view.initialized && <Animatable.View animation={ "fadeIn" } style={ { height: "100%", flex: 1 } }>
        <View flex>
            <BrowserHeader isSearchMode={ view.isSearchMode }
                           onPressSearch={ view.onPressSearch }
                           title={ view.title } url={ view.url }
                           icon={ view.icon }
                           onPressMenu={ view.webviewRef?.reload }
                           onSearchSubmit={ view.onSearchSubmit }
            />
            <View flex-10>
                <ProgressBar backgroundColor={ +view.progress >= 100 ? Colors.grey70 : Colors.violet60 }
                             progressBackgroundColor={ Colors.grey70 }
                             height={ 2 } progress={ view.progress }/>
                <WebView
                    ref={ webViewRef }
                    javaScriptEnabled
                    bounces={ false }
                    localStorageEnabled
                    setSupportMultipleWindows={ false }
                    onNavigationStateChange={ view.navChanged }
                    onPermissionRequest={ (req) => console.log("PERM", req) }
                    onMessage={ view.onMessage }
                    onLoad={ (v) => console.log("LOADING-STARTED") }
                    onLoadEnd={ view.onLoadEnd }
                    onLoadProgress={ view.onProgress }
                    onShouldStartLoadWithRequest={ view.onShouldStartLoadWithRequest }
                    injectedJavaScriptBeforeContentLoaded={ view.entryScriptWeb3 }
                    source={ { uri: view.initialUrl } }
                />
            </View>
            <View bg-grey70 paddingT-10 center row width={ '100%' }>
                <View flex-4 center row>
                    <Ripple onPress={ view.goBack }
                            style={ { width: 40, marginLeft: 20, padding: 10, paddingLeft: 13 } }
                            rippleContainerBorderRadius={ 20 }
                            rippleColor={ Colors.primary }>
                        <HIcon name={ "arrow-left" } size={ 20 } color="#0066DA"/>
                    </Ripple>
                    <Ripple onPress={ view.goForward }
                            style={ { width: 40, marginLeft: 20, padding: 10, paddingLeft: 13 } }
                            rippleContainerBorderRadius={ 20 }
                            rippleColor={ Colors.primary }>
                        <HIcon name={ "arrow-right" } size={ 20 } color="#0066DA"/>
                    </Ripple>
                </View>
                <View flex-2 center>
                    <Button onPress={ () => {
                      selectDialog.display = true
                    } } bg-purple40
                            label={ getWalletStore().selectedWallet.formatAddress.split('...')[1] }/>
                </View>
                <View flex-4 row>
                    <Ripple onPress={ () => !view.isHomePage && view.go(view.homePage) }
                            style={ { width: 40, marginLeft: 20, padding: 10 } }
                            rippleContainerBorderRadius={ 20 }
                            rippleColor={ Colors.primary }>
                        <HIcon name={ "home" } size={ 20 } color="#0066DA"/>
                    </Ripple>
                    <Ripple onPress={ () => {
                      exploreModal.display = true
                    } }
                            style={ { width: 40, marginLeft: 20, padding: 10 } }
                            rippleContainerBorderRadius={ 20 }
                            rippleColor={ Colors.primary }>
                        <HIcon name={ "clone" } size={ 20 } color="#0066DA"/>
                    </Ripple>
                </View>
            </View>
        </View>
    </Animatable.View> }
    { !view.initialized && <LoaderScreen/> }
  </Screen> } after={
    <>
      <ExploreModal/>
      <SelectWalletDialog/>
      <ApprovalDappConnectDialog/>
    </>
  } isBlurActive={ selectDialog.display }/>
})

export const BrowserTabScreen = provider()(BrowserTab)
BrowserTabScreen.register(
    BrowserTabScreenViewModel,
    SelectWalletDialogViewModel,
    ApprovalDappConnectDialogViewModel,
    ExploreModalViewModel
)
