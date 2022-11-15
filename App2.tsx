import React from "react"
import { ThemeProvider } from "context/theme/ThemeProvider"
import { Provider as PaperProvider } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context/src/SafeAreaContext"
import { MovIcon } from "ui/components/icon/MovIcon"
import { AppNavigation } from "navigation/AppNavigation"
import { provider } from "react-ioc"
import { AppService } from "./app/services/AppService"
import { StorageService } from "./app/services/StorageService"
import { WalletConnectService } from "./app/services/WalletConnectService"
import { ProviderService } from "./app/services/ProviderService"
import { CardSkinService } from "./app/services/microServices/cardSkin"
import { CardService } from "./app/services/microServices/cardService"
import { withWalletConnect } from "@walletconnect/react-native-dapp"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { IAsyncStorage } from "keyvaluestorage/dist/cjs/react-native/types"
import { WalletService } from "./app/services/WalletService"
import { LogBox } from "react-native"
import "./app/i18n/i18n"

LogBox.ignoreLogs([
  "new NativeEventEmitter()",
])

export const AppScreen = () => {
  return (
    <PaperProvider
      settings={ {
        icon: props => <MovIcon { ...props } />,
      } }
    >
      <SafeAreaProvider>
        <ThemeProvider>
          <AppNavigation />
        </ThemeProvider>
      </SafeAreaProvider>
    </PaperProvider>
  )
}

const AppWithProvider = provider()(AppScreen)

AppWithProvider.register(
  AppService,
  StorageService,
  WalletConnectService,
  WalletService,
  ProviderService,
  CardSkinService,
  CardService,
)

export const App = withWalletConnect(AppWithProvider, {
  redirectUrl: "mover://",
  storageOptions: {
    asyncStorage: AsyncStorage as unknown as IAsyncStorage,
  },
})
