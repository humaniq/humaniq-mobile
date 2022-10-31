import { observer } from "mobx-react-lite";
import { provider, useInstance } from "react-ioc";
import { AppService } from "./services/AppService";
import React, { useEffect } from "react";
import { Text, View } from "react-native-ui-lib";
import { Button } from "react-native";

const AppScreen = observer(() => {

  const app = useInstance(AppService);

  useEffect(() => {
    app.init();
  }, []);

  return <View flex style={ { minHeight: "100%" } }>
    <View flex center>
      <Text>{ app.counter }</Text>
      <Button  onPress={() => { console.log("RRERE"); app.increment() } } title={ "Increment" }></Button>
    </View>
  </View>;
});

export const App = provider()(AppScreen);
App.register(
  AppService,
);
