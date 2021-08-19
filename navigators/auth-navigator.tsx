import { createStackNavigator } from "@react-navigation/stack";
import { Colors } from "react-native-ui-lib";
import React from "react";
import { AuthScreen } from "../screens/auth/AuthScreen";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";

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
        name="auth"
        component={ AuthScreen }
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
