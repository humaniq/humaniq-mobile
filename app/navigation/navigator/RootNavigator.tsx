import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { RootStackParamList } from "types/navigation"
import * as React from "react"
import { BottomNavigator } from "navigation/navigator/BottomNavigator"
import { ContactDetailsScreen } from "ui/screens/details/ContactDetailsScreen"
import { SettingsScreen } from "ui/screens/settings/SettingsScreen"
import { CreateTagScreen } from "ui/screens/tag/CreateTagScreen"
import { PersonalInfoScreen } from "ui/screens/personal/PersonalInfoScreen"
import { PhoneValidationScreen } from "ui/screens/phone/PhoneValidationScreen"
import { MAIN_STACK, SCREENS } from "navigation/path"

export const Stack = createNativeStackNavigator<RootStackParamList>()

const screenOptions = {
  headerShown: false
}

export const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={ screenOptions } initialRouteName={ SCREENS.PHONE_VALIDATION_SCREEN }>
      <Stack.Screen
        component={ BottomNavigator }
        name={ MAIN_STACK }
      />
      <Stack.Screen
        component={ ContactDetailsScreen }
        name={ SCREENS.CONTACT_DETAILS_SCREEN }
      />
      <Stack.Screen
        component={ SettingsScreen }
        name={ SCREENS.SETTINGS_SCREEN }
      />
      <Stack.Screen
        component={ CreateTagScreen }
        name={ SCREENS.CREATE_TAG_SCREEN }
      />
      <Stack.Screen
        component={ PersonalInfoScreen }
        name={ SCREENS.PERSONAL_INFO_SCREEN }
      />
      <Stack.Screen
        component={ PhoneValidationScreen }
        name={ SCREENS.PHONE_VALIDATION_SCREEN }
      />
    </Stack.Navigator>
  )
}
