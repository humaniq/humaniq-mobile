import React from "react"
import { ThemeProvider } from "context/theme/ThemeProvider"
import { Provider as PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context/src/SafeAreaContext'
import { MovIcon } from "ui/components/icon"
import { AppNavigation } from "navigation/AppNavigation"

export const App2 = () => {
  return (
    <PaperProvider
      settings={ {
        icon: props => <MovIcon { ...props } />
      } }
    >
      <SafeAreaProvider>
        <ThemeProvider>
          <AppNavigation/>
        </ThemeProvider>
      </SafeAreaProvider>
    </PaperProvider>
  )
}
