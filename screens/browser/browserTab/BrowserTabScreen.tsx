import { observer } from "mobx-react-lite"
import { provider, useInstance } from "react-ioc"
import { BrowserTabScreenViewModel } from "./BrowserTabScreenViewModel"
import React, { useEffect, useRef } from "react"
import { View } from "react-native-ui-lib"
import * as Animatable from "react-native-animatable"
import { useNavigation } from "@react-navigation/native"
import WebView from "react-native-webview"
import {
  ApprovalDappConnectDialogViewModel
} from "../../../components/dialogs/approvalDappConnectDialog/ApprovalDappConnectDialogViewModel"
import {
  ApprovalDappConnectDialog
} from "../../../components/dialogs/approvalDappConnectDialog/ApprovalDappConnectDialog"
import { BrowserHeader } from "../../../components/browserHeader/BrowserHeader"
import { ExploreModalViewModel } from "../ExploreModalViewModel"
import { getBrowserStore } from "../../../App";
import { SelectWalletDialog } from "../../../components/dialogs/selectWalletDialog/SelectWalletDialog";
import {
  SelectWalletDialogViewModel
} from "../../../components/dialogs/selectWalletDialog/SelectWalletDialogViewModel";
import {
  SelectNetworkDialogViewModel
} from "../../../components/dialogs/selectNetworkDialog/SelectNetworkDialogViewModel";
import { SelectNetworkDialog } from "../../../components/dialogs/selectNetworkDialog/SelectNetworkDialog";

export interface IBrowserTab {
  initialUrl: string
  id: string
  key: string,
  showTabs: () => any
  newTab: () => any,
}

const BrowserTab = observer<IBrowserTab>((props) => {
  const view = useInstance(BrowserTabScreenViewModel)
  const nav = useNavigation()
  const selectAddress = useInstance(SelectWalletDialogViewModel)
  const selectNetwork = useInstance(SelectNetworkDialogViewModel)
  const webViewRef = useRef()

  useEffect(() => {
    view.init(nav, props)
    return () => view.disposeAll()
  }, [])

  useEffect(() => {
    if (webViewRef.current) {
      view.webviewRef = webViewRef.current
    }
  }, [ webViewRef.current ])


  return <>
    { view.initialized && <Animatable.View animation={ "fadeIn" } style={ view.isTabActive ? {
      minHeight: "100%",
      display: "flex"
    } : { display: 'none' } }>
        <View flex>
            <BrowserHeader isSearchMode={ view.isSearchMode }
                           onPressSearch={ view.onPressSearch }
                           title={ view.title }
                           url={ view.storedTab.url }
                           icon={ view.icon }
                           reloadPage={ view.webviewRef?.reload }
                           onSearchSubmit={ view.onSearchSubmit }
                           goHomePage={ view.goHomePage }
                           numOfTabs={ getBrowserStore().tabs.length }
                           openTabs={ props.showTabs }
                           changeAddress={ () => selectAddress.display = true }
                           changeNetwork={ () => selectNetwork.display = true }
                           openNewTab={ props.newTab }
            />
            <View flex-10 flexG-10>
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
        </View>
    </Animatable.View> }
  </>
})

export const BrowserTabScreen = provider()(BrowserTab)
BrowserTabScreen.register(
    BrowserTabScreenViewModel,
)
