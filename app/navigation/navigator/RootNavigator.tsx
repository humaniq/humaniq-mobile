import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { RootStackParamList } from "types/navigation"
import * as PATHS from "navigation/path"
import * as React from "react"
import { BottomNavigator } from "navigation/navigator/BottomNavigator"
import { ContactDetailsScreen } from "ui/screens/details/ContactDetailsScreen"
import { SettingsScreen } from "ui/screens/settings/SettingsScreen"
import { CreateTagScreen } from "ui/screens/tag/CreateTagScreen"
import { PersonalInfoScreen } from "ui/screens/personal/PersonalInfoScreen"

export const Stack = createNativeStackNavigator<RootStackParamList>()

const screenOptions = {
  headerShown: false
}

export const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={ screenOptions } initialRouteName={ "Settings" }>
      <Stack.Screen
        component={ BottomNavigator }
        name={ PATHS.MAIN_STACK }
      />
      <Stack.Screen
        component={ ContactDetailsScreen }
        name={ PATHS.CONTACT_DETAILS_SCREEN }
      />
      <Stack.Screen
        component={ SettingsScreen }
        name={ PATHS.SETTINGS_SCREEN }
      />
      <Stack.Screen
        component={ CreateTagScreen }
        name={ PATHS.CREATE_TAG_SCREEN }
      />
      <Stack.Screen
        component={ PersonalInfoScreen }
        name={ PATHS.PERSONAL_INFO_SCREEN }
      />
    </Stack.Navigator>
  )
}
