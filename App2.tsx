import React, { useEffect } from "react"
import { ThemeProvider } from "context/theme/ThemeProvider"
import { Provider as PaperProvider } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context/src/SafeAreaContext"
import { MovIcon } from "ui/components/icon/MovIcon"
import { AppNavigation } from "navigation/AppNavigation"
import { provider, useInstance } from "react-ioc"
import { AppController as AppController } from "./app/controllers/AppController"
import { StorageController } from "./app/controllers/StorageController"
import { WalletConnectController } from "./app/controllers/WalletConnectController"
import { ProviderController } from "./app/controllers/ProviderController"
import { withWalletConnect } from "@walletconnect/react-native-dapp"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { IAsyncStorage } from "keyvaluestorage/dist/cjs/react-native/types"
import { WalletController } from "./app/controllers/WalletController"
import { LogBox } from "react-native"
import "./app/i18n/i18n"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { ConnectProviderSheet } from "ui/components/sheet/ConnectProviderSheet"
import { observer } from "mobx-react-lite"
import { useWalletConnect as useWC } from "@walletconnect/react-native-dapp/dist/hooks"
import { configure } from "mobx"
import { CardSkinController } from "./app/controllers/CardSkinController"
import { CardController } from "./app/controllers/CardController"

configure({
  enforceActions: "never",
})

LogBox.ignoreLogs([
  "new NativeEventEmitter()",
])

export const AppScreen = observer(() => {

  const app = useInstance(AppController)
  const connector = useWC()
  const wc = useInstance(WalletConnectController)
  const walletService = useInstance(WalletController)

  useEffect(() => {
    connector.protocol && wc.init(connector)
  }, [ connector ])

  useEffect(() => {
    app.init()
  }, [])

  return (
    <PaperProvider
      settings={ {
        icon: props => <MovIcon { ...props } />,
      } }
    >
      <SafeAreaProvider>
        <ThemeProvider>
          <BottomSheetModalProvider>
            <AppNavigation />
            <ConnectProviderSheet
              visible={ walletService.connectProviderModalVisible }
              onDismiss={ () => walletService.setConnectProviderModal(false) }
              onProviderPressed={ (selectedProviderId) => {
                walletService.setConnectProviderModal(false)
                walletService.tryInit(selectedProviderId)
              } }
            />
          </BottomSheetModalProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </PaperProvider>
  )
})

const AppWithProvider = provider()(AppScreen)

AppWithProvider.register(
  AppController,
  StorageController,
  WalletConnectController,
  WalletController,
  ProviderController,
  CardSkinController,
  CardController,
)

export const App = withWalletConnect(AppWithProvider, {
  redirectUrl: "mover://",
  storageOptions: {
    asyncStorage: AsyncStorage as unknown as IAsyncStorage,
  },
})
