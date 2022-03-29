/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import "./shim"
import "react-native-get-random-values"
import "react-native-gesture-handler"
import { LogBox } from "react-native";
import React, { useEffect, useRef } from "react"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import "@ethersproject/shims"
import 'react-native-url-polyfill/auto'
import { provider, toFactory, useInstance } from "react-ioc"
import { observer } from "mobx-react-lite"
import { NavigationContainerRef } from "@react-navigation/native"
import * as storage from "./utils/localStorage"
import { canExit, RootNavigator, setRootNavigation, useBackButtonHandler, useNavigationPersistence } from "./navigators"
import { enableScreens } from "react-native-screens"
import { configure } from "mobx"
import "./theme/color"
import "./theme/typography"
import { RootStore } from "./store/RootStore"
import { createContext, registerRootStore } from "mobx-keystone"
import ErrorBoundary from "react-native-error-boundary";
import { APP_STATE, AppStore } from "./store/app/AppStore"
import { AuthNavigator } from "./navigators/auth-navigator"
import { Locker } from "./components/locker/Locker"
import { WalletStore } from "./store/wallet/WalletStore"
import { RequestStore } from "./store/api/RequestStore"
import { DictionaryStore } from "./store/dictionary/DictionaryStore"
import { ProfileStore } from "./store/profile/ProfileStore"
import { ProviderStore } from "./store/provider/ProviderStore"
import { EVMProvider } from "./store/provider/EVMProvider"
import { SigningDialog } from "./components/dialogs/signingDialog/SigningDialog"
import {
    SendTransactionViewModel as LegacySendTransactonViewModel
} from "./components/dialogs/sendTransactionDialog/SendTransactionViewModel"
import { SendTransactionDialog } from "./components/dialogs/sendTransactionDialog/SendTransactionDialog"
import { MoralisRequestStore } from "./store/api/MoralisRequestStore"
import { WalletsScreenModel } from "./screens/wallets/WalletsScreenModel";
import { CreateWalletToast } from "./components/toasts/createWalletToast/CreateWalletToast";
import { AppToast } from "./components/toasts/appToast/AppToast";
import {
    SelfAddressQrCodeDialogViewModel
} from "./components/dialogs/selfAddressQrCodeDialog/SelfAddressQrCodeDialogViewModel";
import { SendTransactionViewModel } from "./screens/transactions/sendTransaction/SendTransactionViewModel";
import { SelectWalletTokenViewModel } from "./components/dialogs/selectWalletTokenDialog/SelectWalletTokenViewModel";
import {
    SelectTransactionFeeDialogViewModel
} from "./components/dialogs/selectTransactionFeeDialog/SelectTransactionFeeDialogViewModel";
import { Splash } from "./components/splash/Splash";
import { BrowserStore } from "./store/browser/BrowserStore";
import * as Sentry from "@sentry/react-native";
import { applyTheme } from "./theme/componentTheme";
import { CustomFallback } from "./components/customFallback/CustomFallback";
import { isDev } from "./shim";
import { CENTRY_URL } from "./config/api";
import { HumaniqIDScreen } from "./screens/humaniqid/HumaniqIDScreen";

applyTheme()

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation()

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

LogBox.ignoreLogs([
    "Setting a timer",
    "Require cycle",
    "componentWillReceiveProps",
    'Non-serializable values were found in the navigation state',
    "new NativeEventEmitter()",
    "rightButtonProps.iconSource"
])

enableScreens()

configure({
    enforceActions: "never"
})

const appStore = createContext<AppStore>()
export const getAppStore = () => appStore.getDefault()
const walletStore = createContext<WalletStore>()
export const getWalletStore = () => walletStore.getDefault()
const moralisRequestStore = createContext<MoralisRequestStore>()
export const getMoralisRequest = () => moralisRequestStore.getDefault()
const requestStore = createContext<RequestStore>()
export const getRequest = () => requestStore.getDefault()
const dictionaryStore = createContext<DictionaryStore>()
export const getDictionary = () => dictionaryStore.getDefault()
const profileStore = createContext<ProfileStore>()
export const getProfileStore = () => profileStore.getDefault()
const providerStore = createContext<ProviderStore>()
export const getProviderStore = () => providerStore.getDefault()
const EVMProviderStore = createContext<EVMProvider>()
export const getEVMProvider = () => EVMProviderStore.getDefault()
const browserStore = createContext<BrowserStore>()
export const getBrowserStore = () => browserStore.getDefault()

function createRootStore() {
    const rootStore = new RootStore({})
    registerRootStore(rootStore)
    appStore.setDefault(rootStore.appStore)
    walletStore.setDefault(rootStore.walletStore)
    moralisRequestStore.setDefault(rootStore.moralisRequestStore)
    requestStore.setDefault(rootStore.requestStore)
    dictionaryStore.setDefault(rootStore.dictionaryStore)
    profileStore.setDefault(rootStore.profileStore)
    providerStore.setDefault(rootStore.providerStore)
    EVMProviderStore.setDefault(rootStore.providerStore.eth)
    browserStore.setDefault(rootStore.browserStore)
    return rootStore
}

const AppScreen = observer(() => {
    const navigationRef = useRef<NavigationContainerRef<any>>(null)
    const store = useInstance(RootStore)

    setRootNavigation(navigationRef)
    useBackButtonHandler(navigationRef, canExit)

    const { initialNavigationState, onNavigationStateChange } = useNavigationPersistence(
        storage,
        NAVIGATION_PERSISTENCE_KEY
    )

    useEffect(() => {
        ;(async () => {
            await store.profileStore.init()
            await store.dictionaryStore.init()
            await store.moralisRequestStore.init()
            await store.requestStore.init()
            await store.providerStore.init()
            await store.walletStore.init()
            await store.appStore.init()
            await store.browserStore.init()
        })()
    }, [])

    return (
        <SafeAreaProvider initialMetrics={ initialWindowMetrics }>
            <ErrorBoundary FallbackComponent={ CustomFallback }>
                {
                    store.appStore.initialized &&
                    store.appStore.appState === APP_STATE.APP &&
                    !store.appStore.isLocked &&
                    <><RootNavigator
                        ref={ navigationRef }
                        initialState={ initialNavigationState }
                        onStateChange={ onNavigationStateChange }
                        onReady={ () => {
                            // Register the navigation container with the instrumentation
                            routingInstrumentation && routingInstrumentation.registerNavigationContainer(navigationRef);
                        } }
                    />
                        <CreateWalletToast/>
                        <SigningDialog/>
                        <SendTransactionDialog/>
                    </> }
                { !store.appStore.isLocked && <AppToast/> }
                {
                    store.appStore.initialized &&
                    store.appStore.appState === APP_STATE.AUTH &&
                    !store.appStore.isLocked && !store.profileStore.isSuggested &&
                    <HumaniqIDScreen/>
                }
                {
                    store.appStore.initialized &&
                    store.appStore.appState === APP_STATE.AUTH &&
                    !store.appStore.isLocked && store.profileStore.isSuggested &&
                    <AuthNavigator/>
                }
                {
                    store.appStore.initialized &&
                    store.appStore.isLocked &&
                    <Locker/>
                }

                { !store.appStore.initialized && <Splash/> }
            </ErrorBoundary>
        </SafeAreaProvider>
    )
})

const App = provider()(AppScreen)
App.register(
    [ RootStore, toFactory(createRootStore) ],
    WalletsScreenModel,
    LegacySendTransactonViewModel,
    SelfAddressQrCodeDialogViewModel,
    SendTransactionViewModel,
    SelectWalletTokenViewModel,
    SelectTransactionFeeDialogViewModel,
    // QRScannerView
)

if (!isDev) {
    Sentry.init({
        dsn: CENTRY_URL,
        tracesSampleRate: 1.0,
        integrations: [
            new Sentry.ReactNativeTracing({
                routingInstrumentation,
            }),
        ],
    });

    Sentry.wrap(App)
}

export default App