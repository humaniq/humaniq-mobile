// import "./shim"
// import "@ethersproject/shims";
import { observer } from "mobx-react-lite"
import { provider, useInstance } from "react-ioc"
import React, { useEffect } from "react"
import { AppService } from "app/services/AppService"
import { StorageService } from "app/services/StorageService"
import { WalletConnectService } from "app/services/WalletConnectService"
import { useWalletConnect, withWalletConnect } from "@walletconnect/react-native-dapp"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Button, View, Text } from "react-native"
import { IAsyncStorage } from "keyvaluestorage/dist/cjs/react-native/types"
import { ProviderService } from "app/services/ProviderService"
import { MovIcon } from "app/ui/components/icon"

// import { configure } from "mobx"

// configure({
//   enforceActions: "never",
// })

const AppScreen = observer(() => {

  const app = useInstance(AppService)
  const provider = useInstance(ProviderService)
  const wc = useInstance(WalletConnectService)
  const connector = useWalletConnect()

  useEffect(() => {
    wc.init(connector)
  }, [connector])

  useEffect(() => {
    app.init()
    provider.init()
  }, [])


  return <View style={ { minHeight: "100%" } }>
    <MovIcon name={ "logo" } size={ 200 } color={ "#fff" }/>
    <View>
      {
        connector.connected && <View>
          <View><Text>{ provider.chainId }</Text></View>
          <View><Text>{ provider.address }</Text></View>
          <View><Text>{ provider.balance }</Text></View>
        </View>
      }
      { !connector.connected ? <Button title={ "Connect" } onPress={ () => connector.connect() }/> :
        <Button title={ "Kill session" } onPress={ () => connector.killSession() }/> }
    </View>
  </View>
})

const AppWithProvider = provider()(AppScreen)

AppWithProvider.register(
  AppService,
  StorageService,
  WalletConnectService,
  ProviderService
)

export const App = withWalletConnect(AppWithProvider, {
  redirectUrl: "mover://",
  storageOptions: {
    asyncStorage: AsyncStorage as unknown as IAsyncStorage
  }
})
