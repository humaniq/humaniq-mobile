import * as React from "react"
import { FC } from "react"
import {
  NavigationContainer,
} from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { navigationRef } from "navigation/RootNavigation"
import { RootStackParamList } from "types/navigation"
import { RootNavigator } from "navigation/navigator/RootNavigator"
import { canExit, useBackButtonHandler } from "navigation/navigator/NavigationUtils"
import { observer } from "mobx-react-lite"

export const Stack = createNativeStackNavigator<RootStackParamList>()

export const AppNavigation: FC = observer(() => {
  useBackButtonHandler(navigationRef, canExit)

  return (
    <NavigationContainer ref={ navigationRef }>
      <RootNavigator />
    </NavigationContainer>
  )
})
