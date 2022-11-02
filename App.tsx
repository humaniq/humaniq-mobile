// import "./shim"
// import "@ethersproject/shims";
import { observer } from "mobx-react-lite";
import { provider, useInstance } from "react-ioc";
import React, { useEffect } from "react";
import { Colors, Text, View } from "react-native-ui-lib";
import "app/theme/color";
import "app/theme/typography";
import { AppService } from "app/services/AppService";
import { applyTheme } from "app/theme/componentTheme";
import { StorageService } from "./app/services/StorageService";
import { WalletConnectService } from "./app/services/WalletConnectService";
import { useWalletConnect, withWalletConnect } from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native";

applyTheme();

require("react-native-ui-lib/config").setConfig({ appScheme: "default" });

const AppScreen = observer(() => {

  const app = useInstance(AppService);
  const wc = useInstance(WalletConnectService);
  const connector = useWalletConnect();

  useEffect(() => {
    app.init();
  }, []);

  useEffect(() => {
    wc.init(connector)
  }, [connector])

  return <View flex style={ { minHeight: "100%" } }>
    <View flex center>
      <Text>{ app.counter }</Text>
      <Button onPress={ () => {
        console.log("RRERE");
        app.increment();
      } } title={ "Increment" }></Button>
      { !connector.connected ? <Button title={ "Connect" } onPress={ () => connector.connect() } /> :
        <Button title={ "Kill session" } onPress={ () => connector.killSession() } /> }
    </View>
  </View>;
});

const AppWithProvider = provider()(AppScreen);

AppWithProvider.register(
  AppService,
  StorageService,
  WalletConnectService
);

// export const App = AppWithProvider;

export const App = withWalletConnect(AppWithProvider, {
  redirectUrl: "mover://",
  storageOptions: {
    asyncStorage: AsyncStorage,
  },
});
