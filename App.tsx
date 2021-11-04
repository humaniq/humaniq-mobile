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
import "react-native-gesture-handler"
import React, { useEffect, useRef } from "react"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import "@ethersproject/shims"
import 'react-native-url-polyfill/auto'
import { provider, toFactory, useInstance } from "react-ioc"
import { observer } from "mobx-react-lite"
import { NavigationContainerRef } from "@react-navigation/native"
import { LoaderScreen } from "react-native-ui-lib"
import * as storage from "./utils/localStorage"
import { canExit, RootNavigator, setRootNavigation, useBackButtonHandler, useNavigationPersistence } from "./navigators"
import { enableScreens } from "react-native-screens"
import { configure } from "mobx"
import "./theme/color"
import "./theme/typography"
import { RootStore } from "./store/RootStore"
import { createContext, registerRootStore } from "mobx-keystone"
import { LogBox } from "react-native"
import { APP_STATE, AppStore } from "./store/app/AppStore"
import { AuthNavigator } from "./navigators/auth-navigator"
import { Locker } from "./components/locker/Locker"
import { WalletStore } from "./store/wallet/WalletStore"
import { RequestStore } from "./store/api/RequestStore"
import { DictionaryStore } from "./store/dictionary/DictionaryStore"
import { ProfileStore } from "./store/profile/ProfileStore"
import { ProviderStore } from "./store/provider/ProviderStore"
import { EthereumProvider } from "./store/provider/EthereumProvider"
import { SigningDialog } from "./components/dialogs/signingDialog/SigningDialog"
import { SendWalletTransactionViewModel } from "./components/dialogs/sendWalletTransactionDialog/SendWalletTransactionViewModel"
import { SendWalletTransactionDialog } from "./components/dialogs/sendWalletTransactionDialog/SendWalletTransactionDialog"
import { SendTransactionViewModel as LegacySendTransactonViewModel } from "./components/dialogs/sendTransactionDialog/SendTransactionViewModel"
import { SendTransactionDialog } from "./components/dialogs/sendTransactionDialog/SendTransactionDialog"
import { MoralisRequestStore } from "./store/api/MoralisRequestStore"
import { WaitForEthTransactionViewModel } from "./screens/transactions/sendTransaction/WaitForEthTransactionViewModel"
import { WalletsScreenModel } from "./screens/wallets/WalletsScreenModel";
import { CreateWalletToast } from "./components/toasts/createWalletToast/CreateWalletToast";
import { AppToast } from "./components/toasts/appToast/AppToast";
import { SelfAddressQrCodeDialogViewModel } from "./components/dialogs/selfAddressQrCodeDialog/SelfAddressQrCodeDialogViewModel";
import { WalletMenuDialogViewModel } from "./components/dialogs/menuWalletDialog/WalletMenuDialogViewModel";
import { SendTransactionViewModel } from "./screens/transactions/sendTransaction/SendTransactionViewModel";
import { SelectWalletTokenViewModel } from "./components/dialogs/selectWalletTokenDialog/SelectWalletTokenViewModel";
import { SelectTransactionFeeDialogViewModel } from "./components/dialogs/selectTransactionFeeDialog/SelectTransactionFeeDialogViewModel";

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

LogBox.ignoreLogs([ "Setting a timer" ])
LogBox.ignoreLogs([ "Require cycle" ])
LogBox.ignoreLogs([ "componentWillReceiveProps" ])

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
const ethereumProvider = createContext<EthereumProvider>()
export const getEthereumProvider = () => ethereumProvider.getDefault()

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
      await store.dictionaryStore.init()
      await store.moralisRequestStore.init()
      await store.requestStore.init()
      await store.profileStore.init()
      await store.providerStore.init()
      await store.walletStore.init()
      await store.appStore.init()
    })()
  }, [])

  return (<>
        <SafeAreaProvider initialMetrics={ initialWindowMetrics }>
          {
            store.appStore.initialized &&
            store.appStore.appState === APP_STATE.APP &&
            !store.appStore.isLocked &&
            <><RootNavigator
                ref={ navigationRef }
                initialState={ initialNavigationState }
                onStateChange={ onNavigationStateChange }
            />
                <AppToast/>
                <CreateWalletToast/>
                <SigningDialog/>
                <SendWalletTransactionDialog/>
                <SendTransactionDialog/>
            </> }
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
      </>
  )
})

const App = provider()(AppScreen)
App.register(
    [ RootStore, toFactory(createRootStore) ],
    WalletsScreenModel,
    SendWalletTransactionViewModel,
    LegacySendTransactonViewModel,
    WaitForEthTransactionViewModel,
    SelfAddressQrCodeDialogViewModel,
    WalletMenuDialogViewModel,
    SendTransactionViewModel,
    SelectWalletTokenViewModel,
    SelectTransactionFeeDialogViewModel
)
export default App
