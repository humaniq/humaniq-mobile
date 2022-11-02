// import "./shim"
// import "@ethersproject/shims";
import { observer } from "mobx-react-lite"
import { provider, useInstance } from "react-ioc"
import React, { useEffect } from "react"
import { Text, View } from "react-native-ui-lib"
import "app/theme/color"
import "app/theme/typography"
import { AppService } from "app/services/AppService"
import { applyTheme } from "app/theme/componentTheme"
import { StorageService } from "./app/services/StorageService"
import { WalletConnectService } from "./app/services/WalletConnectService"
import { useWalletConnect, withWalletConnect } from "@walletconnect/react-native-dapp"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Button } from "react-native"
import { IAsyncStorage } from "keyvaluestorage/dist/cjs/react-native/types"
import { ProviderService } from "./app/services/ProviderService"

applyTheme()

require("react-native-ui-lib/config").setConfig({ appScheme: "default" })

const AppScreen = observer(() => {

  const app = useInstance(AppService)
  const provider = useInstance(ProviderService)
  const wc = useInstance(WalletConnectService)
  const connector = useWalletConnect()

  useEffect(() => {
    wc.init(connector)
  }, [ connector ])

  useEffect(() => {
    app.init()
    provider.init()
  }, [])


  return <View flex style={ { minHeight: "100%" } }>
    <View flex center>
      {
        connector.connected && <View center paddingV-10>
          <View row><Text>{ provider.chainId }</Text></View>
          <View row><Text>{ provider.account }</Text></View>
        </View>
      }
      { !connector.connected ? <Button title={ "Connect" } onPress={ () => connector.connect() } /> :
        <Button title={ "Kill session" } onPress={ () => connector.killSession() } /> }
    </View>
  </View>
})

const AppWithProvider = provider()(AppScreen)

AppWithProvider.register(
  AppService,
  StorageService,
  WalletConnectService,
  ProviderService,
)

export const App = withWalletConnect(AppWithProvider, {
  redirectUrl: "mover://",
  storageOptions: {
    asyncStorage: AsyncStorage as unknown as IAsyncStorage,
  },
})
