import React, { useEffect } from "react"
import { ThemeProvider } from "context/theme/ThemeProvider"
import { Provider as PaperProvider } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context/src/SafeAreaContext"
import { MovIcon } from "ui/components/icon/MovIcon"
import { AppNavigation } from "navigation/AppNavigation"
import { provider, useInstance } from "react-ioc"
import { AppService } from "./app/services/AppService"
import { StorageService } from "./app/services/StorageService"
import { WalletConnectService } from "./app/services/WalletConnectService"
import { ProviderService } from "./app/services/ProviderService"
import { CardSkinService } from "./app/services/microServices/cardSkin"
import { CardService } from "./app/services/microServices/cardService"
import { RenderQrcodeModalProps, withWalletConnect } from "@walletconnect/react-native-dapp"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { IAsyncStorage } from "keyvaluestorage/dist/cjs/react-native/types"
import { WalletService } from "./app/services/WalletService"
import { LogBox } from "react-native"
import "./app/i18n/i18n"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { ConnectProviderSheet } from "ui/components/sheet/ConnectProviderSheet"
import { observer } from "mobx-react-lite"
import { useWalletConnect as useWC } from "@walletconnect/react-native-dapp/dist/hooks"
import { configure } from "mobx"

LogBox.ignoreLogs([
  "new NativeEventEmitter()",
])

configure({
  enforceActions: "never",
})

export const AppScreen = observer(() => {

  const app = useInstance(AppService)
  const connector = useWC()
  const wc = useInstance(WalletConnectService)
  const walletService = useInstance(WalletService)

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
    renderQrcodeModal: (props: RenderQrcodeModalProps): JSX.Element => null,
})
