/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React from "react"

import { Colors } from "react-native-ui-lib"
import Ionicons from "react-native-vector-icons/FontAwesome5"
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar"
import { SettingsScreen } from "../screens/settings/SettingsScreen"
import { createStackNavigator } from "@react-navigation/stack"
import { t } from "../i18n"
import { ProfileScreen } from "../screens/profile/ProfileScreen"
import { BrowserScreen } from "../screens/browser/BrowserScreen"
import { TransactionsScreen } from "../screens/wallets/transactions/TransactionsScreen"
import { WaitForEthTransaction } from "../components/toasts/waitForEthTransaction/WaitForEthTransaction"
import { WalletsScreen } from "../screens/wallets/WalletsScreen";

const Stack = createStackNavigator()

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type PrimaryParamList = {
  wallet: undefined
  demo: undefined
  settings: undefined
}


const Tab = AnimatedTabBarNavigator()

export function MainNavigator<PrimaryParamList>() {
  return (
      <Tab.Navigator
          tabBarOptions={ {
            activeTintColor: Colors.bg,
            inactiveTintColor: Colors.grey,
            activeBackgroundColor: Colors.primary,
            showLabels: true
          } }
          screenOptions={ ({ route }) => ({
            headerShown: false,
            tabBarIcon: (options) => {
              let icon = "wallet"
              switch (route.name) {
                case "browser":
                  icon = "globe"
                  break
                case "settings":
                  icon = "cog"
                  break
              }
              return <Ionicons name={ icon } size={ options.size }
                               color={ options.focused ? Colors.bg : Colors.grey }/>
            },
          }) }
          appearance={ { tabBarBackground: Colors.bg } }>
        <Tab.Screen options={ { tabBarLabel: t("walletScreen.name") } } name="wallet"
                    component={ WalletStack }/>
        <Tab.Screen options={ { tabBarLabel: t("browserScreen.name") } } name="browser"
                    component={ BrowserScreen }/>
        <Tab.Screen options={ { tabBarLabel: t("settingsScreen.name") } } name="settings"
                    component={ SettingsStack }/>
      </Tab.Navigator>
  )
}


export function WalletStack() {
  return (
      <><Stack.Navigator screenOptions={ {
        headerShown: false,
      } }>
        <Stack.Screen name="wallet-main" component={ WalletsScreen }/>
        <Stack.Screen name="wallet-eth-transactions" component={ TransactionsScreen }/>
      </Stack.Navigator>
        <WaitForEthTransaction/>
      </>
  )
}


export function SettingsStack() {
  return (
      <Stack.Navigator screenOptions={ {
        headerShown: false,
      } }>
        <Stack.Screen options={ { title: "Настройки" } } name="settings-main" component={ SettingsScreen }/>
        <Stack.Screen name="settings-profile" component={ ProfileScreen }/>
      </Stack.Navigator>
  )
}

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = [ "wallet" ]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
