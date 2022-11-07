import React from "react"
import { ThemeProvider } from "context/theme/ThemeProvider"
import { SafeAreaProvider } from 'react-native-safe-area-context/src/SafeAreaContext'
import { SplashScreen } from "ui/screens/Splash/SplashScreen"

export const App2 = () => {
  return <SafeAreaProvider>
    <ThemeProvider>
      <SplashScreen />
    </ThemeProvider>
  </SafeAreaProvider>
}
