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
import { Colors, LoaderScreen } from "react-native-ui-lib";
import * as storage from "./utils/localStorage";
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
import { RootStore } from "./store/RootStore";
import { registerRootStore } from "mobx-keystone";
import { LogBox } from "react-native";
import { APP_STATE } from "./store/app/AppStore";
import { AuthNavigator } from "./navigators/auth-navigator";
import { Locker } from "./components/locker/Locker";

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE";

LogBox.ignoreLogs([ "Setting a timer" ]);

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
  
  setRootNavigation(navigationRef);
  useBackButtonHandler(navigationRef, canExit);
  
  const { initialNavigationState, onNavigationStateChange } = useNavigationPersistence(
    storage,
    NAVIGATION_PERSISTENCE_KEY
  );
  
  useEffect(() => {
    ;(async () => {
      await store.appStore.init();
      await store.providerStore.init()
      await store.walletStore.init()
    })();
  }, []);
  
  return (
    <SafeAreaProvider style={ { backgroundColor: Colors.primary } } initialMetrics={ initialWindowMetrics }>
      {
        store.appStore.initialized &&
        store.appStore.appState === APP_STATE.APP &&
        !store.appStore.isLocked &&
        <RootNavigator
          ref={ navigationRef }
          initialState={ initialNavigationState }
          onStateChange={ onNavigationStateChange }
        /> }
      {
        store.appStore.initialized &&
        store.appStore.appState === APP_STATE.AUTH &&
        !store.appStore.isLocked &&
        <AuthNavigator />
      }
      {
        store.appStore.initialized &&
        store.appStore.isLocked &&
        <Locker />
      }
      { !store.appStore.initialized && <LoaderScreen /> }
    </SafeAreaProvider>
  );
});

const App = provider()(AppScreen);
App.register(
  [ RootStore, toFactory(createRootStore) ]
);
export default App;
