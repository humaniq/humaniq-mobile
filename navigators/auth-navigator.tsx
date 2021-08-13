import { createStackNavigator } from "@react-navigation/stack";
import { Colors } from "react-native-ui-lib";
import React from "react";
import { RegisterScreen } from "../screens/auth/register/RegisterScreen";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";

export type AuthStachParamsList = {
  register: undefined
  restore: undefined
  login: undefined
}

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={ {
        cardStyle: { backgroundColor: Colors.grey70 },
        headerShown: false
      } }
    >
      <Stack.Screen
        name="register"
        component={ RegisterScreen }
        options={ {
          headerShown: false
        } }
      />
      <Stack.Screen
        name="restore"
        component={ RegisterScreen }
        options={ {
          headerShown: false
        } }
      />
    </Stack.Navigator>
  );
};

export const AuthNavigator = React.forwardRef<NavigationContainerRef,
  Partial<React.ComponentProps<typeof NavigationContainer>>>((props, ref) => {
  return (
    <NavigationContainer { ...props } ref={ ref }>
      <AuthStack />
    </NavigationContainer>
  );
});

AuthNavigator.displayName = "AuthNavigator";
