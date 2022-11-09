import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { RootStackParamList } from "types/navigation"
import * as PATHS from "navigation/path"
import * as React from "react"
import { BottomNavigator } from "navigation/navigator/BottomNavigator"

export const Stack = createNativeStackNavigator<RootStackParamList>()

const screenOptions = {
  headerShown: false
}

export const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={ screenOptions }>
      <Stack.Screen
        component={ BottomNavigator }
        name={ PATHS.MAIN_STACK }
      />
    </Stack.Navigator>
  )
}
