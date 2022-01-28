/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React, { useEffect, useState } from "react"

import { Colors, View } from "react-native-ui-lib"
import { SettingsScreen } from "../screens/settings/SettingsScreen"
import { createStackNavigator } from "@react-navigation/stack"
import { ProfileScreen } from "../screens/profile/ProfileScreen"
import { BrowserScreen } from "../screens/browser/BrowserScreen"
import { WalletsScreen } from "../screens/wallets/WalletsScreen";
import { HIcon } from "../components/icon";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { localStorage } from "../utils/localStorage";


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

const Tab = createMaterialBottomTabNavigator()

export function MainNavigator<PrimaryParamList>() {
  const [ seedStored, setSeedStored ] = useState(true)

  useEffect(() => {
    localStorage.load("hm-wallet-recovery-read").then(res => {
      setSeedStored(res || false)
    })
  })



  return (
      <Tab.Navigator
          labeled={ false }
          activeColor={ Colors.primary }
          inactiveColor={ Colors.textGrey }
          barStyle={ { backgroundColor: Colors.white, paddingBottom: 5 } }
          screenOptions={ ({ route }) => ({
            tabBarLabelStyle: { marginTop: 10 },
            headerShown: false,
            tabBarIcon: (options) => {
              switch (route.name) {
                case "browser":
                  return <View padding-5 paddingL-20 marginB-5 br50 width={ 60 } height={ 30 }
                               backgroundColor={ options.focused ? Colors.rgba(Colors.primary, 0.1) : Colors.white }
                  >
                    <HIcon name={ "globe" } size={ 20 }
                           style={ { color: options.focused ? Colors.primary : Colors.textGrey } }/></View>
                case "settings":
                  return <View padding-5 paddingL-20 marginB-5 br50 width={ 60 } height={ 30 }
                               backgroundColor={ options.focused ? Colors.rgba(Colors.primary, 0.1) : Colors.white }
                  >
                    <HIcon
                        name={ "cog" } size={ 20 }
                        style={ { color: options.focused ? Colors.primary : Colors.textGrey } }/></View>
                default:
                  return <View padding-5 paddingL-20 marginB-5 br50
                               backgroundColor={ options.focused ? Colors.rgba(Colors.primary, 0.1) : Colors.white }
                               width={ 60 } height={ 30 }><HIcon
                      name={ "wallet" } size={ 20 }
                      style={ { color: options.focused ? Colors.primary : Colors.textGrey } }/></View>
              }
            },
          }) }>
        <Tab.Screen name="wallet"
                    component={ WalletStack }/>
        <Tab.Screen name="browser"
                    component={ BrowserScreen }/>
        <Tab.Screen name="settings"
                    component={ SettingsStack }
                    options={ { tabBarBadge: !seedStored } }
        />
      </Tab.Navigator>
  )
}

export function WalletStack() {
  return (
      <><Stack.Navigator screenOptions={ {
        headerShown: false,
      } }>
        <Stack.Screen name="wallet-main" component={ WalletsScreen }/>
      </Stack.Navigator>
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
