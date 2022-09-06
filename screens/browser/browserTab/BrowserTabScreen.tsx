import { observer } from "mobx-react-lite"
import { provider, useInstance } from "react-ioc"
import { BrowserTabScreenViewModel } from "./BrowserTabScreenViewModel"
import React, { useEffect, useRef } from "react"
import { Colors, TouchableOpacity, View } from "react-native-ui-lib"
import * as Animatable from "react-native-animatable"
import { useNavigation } from "@react-navigation/native"
import WebView from "react-native-webview"
import { BrowserHeader } from "../../../components/browserHeader/BrowserHeader"
import { getBrowserStore } from "../../../App";
import {
    SelectWalletDialogViewModel
} from "../../../components/dialogs/selectWalletDialog/SelectWalletDialogViewModel";
import {
    SelectNetworkDialogViewModel
} from "../../../components/dialogs/selectNetworkDialog/SelectNetworkDialogViewModel";
import { BackHandler } from "react-native";
import { HIcon } from "../../../components/icon";
import { CSSShadows } from "../../../utils/ui";
import { CustomFallback } from "../../../components/customFallback/CustomFallback";
import { SearchResults } from "../search/SearchResults";

export interface IBrowserTab {
    initialUrl: string
    id: string
    key: string,
    showTabs: (ref: any) => any
    newTab: () => any,
}

const BrowserTab = observer<IBrowserTab>((props) => {
    const view = useInstance(BrowserTabScreenViewModel)
    const nav = useNavigation()
    const selectAddress = useInstance(SelectWalletDialogViewModel)
    const selectNetwork = useInstance(SelectNetworkDialogViewModel)
    const webViewRef = useRef()
    const screenRef = useRef()

    useEffect(() => {
        view.init(nav, props)
        return () => view.disposeAll()
    }, [])

    useEffect(() => {
        if (webViewRef.current) {
            view.webviewRef = webViewRef.current
        }
    }, [ webViewRef.current ])

    useEffect(() => {
        const handleAndroidBackPress = () => {
            if (!view.isTabActive) return false;
            view.backEnabled ? view.goBack() : nav.goBack();
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', handleAndroidBackPress);

        // Handle hardwareBackPress event only for browser, not components rendered on top
        nav.addListener('focus', () => {
            BackHandler.addEventListener('hardwareBackPress', handleAndroidBackPress);
        });
        nav.addListener('blur', () => {
            BackHandler.removeEventListener('hardwareBackPress', handleAndroidBackPress);
        });

        return function cleanup() {
            BackHandler.removeEventListener('hardwareBackPress', handleAndroidBackPress);
        };
    })


    return <>
        { view.initialized && <Animatable.View animation={ "fadeIn" } style={ view.isTabActive ? {
            minHeight: "100%",
            display: "flex"
        } : { display: 'none' } }>
            <View ref={ screenRef } flex testID={ 'browserTabScreen' }>
                <BrowserHeader isSearchMode={ view.isSearchMode }
                               onPressSearch={ view.onPressSearch }
                               url={ view.storedTab.url }
                               reloadPage={ view.reloadWebView }
                               onSearchSubmit={ view.onSearchSubmit }
                               goHomePage={ view.goHomePage }
                               numOfTabs={ getBrowserStore().tabs.length }
                               openTabs={ () => props.showTabs(screenRef) }
                               changeAddress={ () => {
                                   selectAddress.display = true
                               } }
                               changeNetwork={ () => {
                                   selectNetwork.display = true
                               } }
                               openNewTab={ props.newTab }
                               searchValue={ view.searchValue }
                               onValueChange={ view.onSearchChange }
                />
                <SearchResults results={ view.searchResults }
                               onSearchSubmit={ view.onSearchSubmit }
                               isSearchMode={ view.isSearchMode }/>
                <View flex-10 flexG-10 style={ view.isSearchMode ? { display: 'none' } : {} }>
                    <WebView
                        testID={ 'browserWebView' }
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
                        onError={ view.onError }
                        renderError={ () => <CustomFallback/> }
                    />
                </View>
                { view.forwardEnabled &&
                    <View absR absV center>
                        <TouchableOpacity testID={ 'browserBack' } padding-10 br60 marginR-8 onPress={ view.goForward }
                                          style={ {
                                              backgroundColor: Colors.rgba(Colors.white, 0.9), shadowColor: "#000",
                                              ...CSSShadows
                                          } }>
                            <HIcon name={ "arrow-right" } size={ 18 }/>
                        </TouchableOpacity>
                    </View>
                }
                { view.backEnabled &&
                    <View absL absV center>
                        <TouchableOpacity testID={ 'browserForward' } padding-10 br60 marginL-8 onPress={ view.goBack }
                                          style={ {
                                              backgroundColor: Colors.rgba(Colors.white, 0.9), shadowColor: "#000",
                                              ...CSSShadows
                                          } }>
                            <HIcon name={ "arrow-left" } size={ 18 }/>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </Animatable.View> }
    </>
})

export const BrowserTabScreen = provider()(BrowserTab)
BrowserTabScreen.register(
    BrowserTabScreenViewModel,
)
