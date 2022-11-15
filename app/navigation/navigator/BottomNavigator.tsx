import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { SCREENS } from "navigation/path"
import { BottomParamList } from "types/navigation"
import { CardScreen } from "ui/screens/card/CardScreen"
import { EarnScreen } from "ui/screens/earn/EarnScreen"
import { HistoryScreen } from "ui/screens/history/HistoryScreen"
import { BottomBar } from "ui/components/bar/BottomBar"
import { observer } from "mobx-react-lite"

const BottomBarNav = createBottomTabNavigator<BottomParamList>()

const screenOptions = {
  headerShown: false,
}

export const BottomNavigator = observer(({}) => {
  return (
    <BottomBarNav.Navigator screenOptions={ screenOptions } tabBar={ props => <BottomBar { ...props } /> }>
      <BottomBarNav.Screen
        name={ SCREENS.CARD_SCREEN }
        component={ CardScreen }
      />
      <BottomBarNav.Screen
        name={ SCREENS.EARN_SCREEN }
        component={ EarnScreen }
      />
      <BottomBarNav.Screen
        name={ SCREENS.HISTORY_SCREEN }
        component={ HistoryScreen }
      />
    </BottomBarNav.Navigator>
  )
})
