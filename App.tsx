/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import "react-native-gesture-handler"
import React, { useEffect, useRef } from "react"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import "@ethersproject/shims"
import { provider, toFactory, useInstance } from "react-ioc"
import { observer } from "mobx-react-lite"
import { NavigationContainerRef } from "@react-navigation/native"
import { Colors, LoaderScreen } from "react-native-ui-lib"
import * as storage from "./utils/localStorage"
import { canExit, RootNavigator, setRootNavigation, useBackButtonHandler, useNavigationPersistence } from "./navigators"
import { enableScreens } from "react-native-screens"
import { configure } from "mobx"
import "./theme/color"
import "./theme/typography"
import { RootStore } from "./store/RootStore"
import { createContext, registerRootStore } from "mobx-keystone"
import { LogBox } from "react-native"
import { APP_STATE } from "./store/app/AppStore"
import { AuthNavigator } from "./navigators/auth-navigator"
import { Locker } from "./components/locker/Locker"
import { WalletStore } from "./store/wallet/WalletStore"
import { RequestStore } from "./store/api/RequestStore"
import { AuthRequestStore } from "./store/api/AuthRequestStore"
import { AuthStore } from "./store/auth/AuthStore"
import { DictionaryStore } from "./store/dictionary/DictionaryStore"
import { ProfileStore } from "./store/profile/ProfileStore"
import { ProviderStore } from "./store/provider/ProviderStore"
import { EthereumProvider } from "./store/provider/EthereumProvider"

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

LogBox.ignoreLogs([ "Setting a timer" ])
LogBox.ignoreLogs([ "Require cycle" ])

enableScreens()

configure({
    enforceActions: "never"
})

export const walletStore = createContext<WalletStore>()
export const getWalletStore = () => walletStore.getDefault()
export const requestStore = createContext<RequestStore>()
export const getRequest = () => requestStore.getDefault()
export const authRequestStore = createContext<AuthRequestStore>()
export const getAuthRequest = () => authRequestStore.getDefault()
export const authStore = createContext<AuthStore>()
export const getAuthStore = () => authStore.getDefault()
export const dictionaryStore = createContext<DictionaryStore>()
export const getDictionary = () => dictionaryStore.getDefault()
export const profileStore = createContext<ProfileStore>()
export const getProfileStore = () => profileStore.getDefault()
export const providerStore = createContext<ProviderStore>()
export const getProviderStore = () => providerStore.getDefault()
export const ethereumProvider = createContext<EthereumProvider>()
export const getEthereumProvider = () => ethereumProvider.getDefault()

function createRootStore() {
    const rootStore = new RootStore({})
    registerRootStore(rootStore)
    walletStore.setDefault(rootStore.walletStore)
    requestStore.setDefault(rootStore.requestStore)
    authRequestStore.setDefault(rootStore.authRequestStore)
    authStore.setDefault(rootStore.authStore)
    dictionaryStore.setDefault(rootStore.dictionaryStore)
    profileStore.setDefault(rootStore.profileStore)
    providerStore.setDefault(rootStore.providerStore)
    ethereumProvider.setDefault(rootStore.providerStore.eth)
    return rootStore
}


const AppScreen = observer(() => {
    const navigationRef = useRef<NavigationContainerRef>(null)
    const store = useInstance(RootStore)

    setRootNavigation(navigationRef)
    useBackButtonHandler(navigationRef, canExit)

    const { initialNavigationState, onNavigationStateChange } = useNavigationPersistence(
            storage,
            NAVIGATION_PERSISTENCE_KEY
    )

    useEffect(() => {
        ;(async () => {
            await store.authStore.init()
            await store.authRequestStore.init()
            await store.requestStore.init()
            await store.profileStore.init()
            await store.providerStore.init()
            await store.walletStore.init()
            await store.appStore.init()
            store.walletStore.registerObservers()
            store.dictionaryStore.init()
        })()
    }, [])

    return (
            <SafeAreaProvider style={ { backgroundColor: Colors.primary } } initialMetrics={ initialWindowMetrics }>
                {
                    store.appStore.initialized &&
                    store.appStore.appState === APP_STATE.APP &&
                    !store.appStore.isLocked &&
                    <RootNavigator
                            ref={ navigationRef }
                            initialState={ initialNavigationState }
                            onStateChange={ onNavigationStateChange }
                    /> }
                {
                    store.appStore.initialized &&
                    store.appStore.appState === APP_STATE.AUTH &&
                    !store.appStore.isLocked &&
                    <AuthNavigator/>
                }
                {
                    store.appStore.initialized &&
                    store.appStore.isLocked &&
                    <Locker/>
                }
                { !store.appStore.initialized && <LoaderScreen/> }
            </SafeAreaProvider>
    )
})

const App = provider()(AppScreen)
App.register(
        [ RootStore, toFactory(createRootStore) ]
)
export default App
