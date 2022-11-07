import { SplashScreenProps } from "./types"
import { useStyles } from "./styles"
import { Text, TouchableOpacity, View } from "react-native"
import { MenuItem } from "ui/components/menu/MenuItem"
import { SafeArea } from "ui/components/SafeArea"
import React from "react"
import { useTheme } from "hooks/useTheme"
import { Themes } from "context/theme/types"
import { AppStatusBar } from "ui/components/statusbar/AppStatusBar"

export const SplashScreen = ({}: SplashScreenProps) => {
  const styles = useStyles()
  const { switchTheme } = useTheme()

  return (
    <>
      <AppStatusBar/>
      <SafeArea style={ styles.root }>
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
        <TouchableOpacity onPress={ () => {
          switchTheme(Themes.Dark)
        } }>
          <Text>Switch to Dark Mode</Text>
        </TouchableOpacity>
      </SafeArea>
    </>
  )
}
