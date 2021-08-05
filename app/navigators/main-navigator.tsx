/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React from "react"
import { DemoListScreen, DemoScreen, WalletScreen } from "../screens"
import { Colors } from "react-native-ui-lib"
import Ionicons from "react-native-vector-icons/FontAwesome5"
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar"

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
  welcome: undefined
  demo: undefined
  demoList: undefined
}


const Tab = AnimatedTabBarNavigator()

export function MainNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={ {
        activeTintColor: Colors.grey70,
        inactiveTintColor: Colors.dark80,
        activeBackgroundColor: Colors.grey10,
      } }
      screenOptions={ ({ route }) => ({
        headerShown: false,
        tabBarIcon: (options) => {
          let icon = "wallet"
          switch (route.name) {
            case "demo":
              icon = "globe"
              break
            case "demoList":
              icon = "cog"
              break
          }
          return <Ionicons name={ icon } size={ options.size }
                           color={ options.focused ? Colors.grey70 : Colors.grey20 } />
        },
      }) }
      appearance={ { floating: false, tabBarBackground: Colors.grey70 } }>
      <Tab.Screen name="wallet" component={ WalletScreen } />
      <Tab.Screen name="demo" component={ DemoScreen } />
      <Tab.Screen name="demoList" component={ DemoListScreen } />
    </Tab.Navigator>
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
