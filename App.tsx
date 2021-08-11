/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import "react-native-gesture-handler";
import React, { useEffect, useRef } from "react";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import "@ethersproject/shims";
import { provider, toFactory, useInstance } from "react-ioc";
import { observer } from "mobx-react-lite";
import { NavigationContainerRef } from "@react-navigation/native";
import * as storage from "./utils/storage";
import {
  canExit,
  RootNavigator,
  setRootNavigation,
  useBackButtonHandler,
  useNavigationPersistence
} from "./navigators";
import { enableScreens } from "react-native-screens";
import { configure } from "mobx";
import "./theme/color";
import "./theme/typography";
import { RootStore } from "./services/DataContext/RootStore";
import { registerRootStore } from "mobx-keystone";
import { AppViewModel } from "./AppViewModel";
import { LoaderScreen } from "react-native-ui-lib";
import { LogBox } from "react-native";

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE";

LogBox.ignoreLogs(['Setting a timer']);

enableScreens();

configure({
  enforceActions: "never"
});

function createRootStore() {
  const rootStore = new RootStore({});
  registerRootStore(rootStore);
  return rootStore;
}


const AppScreen = observer(() => {
  const navigationRef = useRef<NavigationContainerRef>(null);
  const store = useInstance(RootStore);
  const view = useInstance(AppViewModel);
  
  setRootNavigation(navigationRef);
  useBackButtonHandler(navigationRef, canExit);
  
  const { initialNavigationState, onNavigationStateChange } = useNavigationPersistence(
    storage,
    NAVIGATION_PERSISTENCE_KEY
  );
  
  useEffect(() => {
    ;(async () => {
      await store.providerStore.eth.init();
      await store.walletStore.init();
      view.initialized = true;
    })();
  }, []);
  
  return (
    <SafeAreaProvider initialMetrics={ initialWindowMetrics }>
      { view.initialized && <RootNavigator
        ref={ navigationRef }
        initialState={ initialNavigationState }
        onStateChange={ onNavigationStateChange }
      /> }
      { !view.initialized && <LoaderScreen /> }
    </SafeAreaProvider>
  );
});

const App = provider()(AppScreen);
App.register(
  AppViewModel,
  [ RootStore, toFactory(createRootStore) ]
);
export default App;
