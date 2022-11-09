import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as ROUTES from 'navigation/path'
import { BottomParamList } from "types/navigation"
import { CardScreen } from "ui/screens/card/CardScreen"
import { EarnScreen } from "ui/screens/earn/EarnScreen"
import { HistoryScreen } from "ui/screens/history/HistoryScreen"
import { BottomBar } from "ui/components/bar/BottomBar"

const BottomBarNav = createBottomTabNavigator<BottomParamList>()

const screenOptions = {
  headerShown: false
}

export const BottomNavigator = ({}) => {
  return (
    <BottomBarNav.Navigator screenOptions={ screenOptions } tabBar={ props => <BottomBar { ...props } /> }>
      <BottomBarNav.Screen
        name={ ROUTES.CARD_SCREEN }
        component={ CardScreen }
      />
      <BottomBarNav.Screen
        name={ ROUTES.EARN_SCREEN }
        component={ EarnScreen }
      />
      <BottomBarNav.Screen
        name={ ROUTES.HISTORY_SCREEN }
        component={ HistoryScreen }
      />
    </BottomBarNav.Navigator>
  )
}
