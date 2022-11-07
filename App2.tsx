import React from "react"
import { View } from "react-native"
import { ThemeProvider } from "context/theme/ThemeProvider"
import { MenuItem } from "ui/components/menu/MenuItem"
import { SafeAreaProvider } from 'react-native-safe-area-context/src/SafeAreaContext'
import { SafeArea } from "ui/components/SafeArea"

export const App2 = () => {
  return <SafeAreaProvider>
    <ThemeProvider>
      <SafeArea style={ { flex: 1, padding: 20, marginTop: 10, backgroundColor: "#ffffff" } }>
        <View>
          <MenuItem
            icon={ "deposit" }
            title={ "Top up" }
            subTitle={ "Add cash to debit card" }
            arrowRight
          />
          <MenuItem
            icon={ "deposit" }
            title={ "Top down" }
            subTitle={ "Add cash to debit card" }
          />
          <MenuItem
            icon={ "card" }
            title={ "Top down" }
            subTitle={ "Add cash to debit card" }
            comingSoon
          />
        </View>
      </SafeArea>
    </ThemeProvider>
  </SafeAreaProvider>
}
