// import "./shim"
// import "@ethersproject/shims";
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { useWalletConnect as useWC, withWalletConnect } from "@walletconnect/react-native-dapp"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Button, Text, View } from "react-native"
import { IAsyncStorage } from "keyvaluestorage/dist/cjs/react-native/types"
import { MovIcon } from "app/ui/components/icon"
import { ProviderType } from "./app/references/providers"

import { configure } from "mobx"
import { AppService } from "./app/services/AppService"
import { StorageService } from "./app/services/StorageService"
import { WalletConnectService } from "./app/services/WalletConnectService"
import { ProviderService } from "./app/services/ProviderService"
import { provider, useInstance } from "react-ioc"
import { CardSkinService } from "./app/services/microServices/cardSkin"

configure({
  enforceActions: "never",
})

const AppScreen = observer(() => {

  const app = useInstance(AppService)
  const provider = useInstance(ProviderService)
  const connector = useWC()
  const wc = useInstance(WalletConnectService)

  useEffect(() => {
    connector.protocol && wc.init(connector)
  }, [ connector ])

  useEffect(() => {
    app.init()
  }, [])


  return <View style={ { minHeight: "100%" } }>
    <MovIcon name={ "logo" } size={ 200 } color={ "#fff" } />
    { provider.initialized &&
      <View>
        {
          !!provider.isConnected && <View>
            <View><Text>{ provider.chainId }</Text></View>
            <View><Text>{ provider.address }</Text></View>
            <View><Text>{ provider.balance }</Text></View>
          </View>
        }
        { !provider.isConnected ? <>
            <Button title={ "Connect to WC" } onPress={ () => provider.pureConnect(ProviderType.WalletConnect) } />
            <Button title={ "Connect to MetaMask" } onPress={ () => provider.pureConnect(ProviderType.Metamask) } />
          </> :
          <Button title={ "Kill session" } onPress={ () => provider.disconnect() } /> }
      </View>
    }
    {
      !provider.initialized && <View><Text>Initializing...</Text></View>
    }
  </View>
})

const AppWithProvider = provider()(AppScreen)

AppWithProvider.register(
  AppService,
  StorageService,
  WalletConnectService,
  ProviderService,
  CardSkinService
)

export const App = withWalletConnect(AppWithProvider, {
  redirectUrl: "mover://",
  storageOptions: {
    asyncStorage: AsyncStorage as unknown as IAsyncStorage,
  },
})
