import React from "react"
import { ThemeProvider } from "context/theme/ThemeProvider"
import { Provider as PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context/src/SafeAreaContext'
import { AppNavigation } from "navigation/AppNavigation"
import { MovIcon } from "ui/components/icon/MovIcon"
import "./app/i18n/i18n"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"

export const App2 = () => {
  return (
    <PaperProvider
      settings={ {
        icon: props => <MovIcon { ...props } />
      } }
    >
      <SafeAreaProvider>
        <ThemeProvider>
          <BottomSheetModalProvider>
            <AppNavigation/>
          </BottomSheetModalProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </PaperProvider>
  )
}
