import React from "react"
import { CardScreenTypes } from "./types"
import { useStyles } from "./styles"
import { Text, TouchableOpacity, View } from "react-native"
import { AppStatusBar } from "ui/components/statusbar/AppStatusBar"
import { SafeArea } from "ui/components/SafeArea"
import { MenuItem } from "ui/components/menu/MenuItem"
import { Themes } from "context/theme/types"
import { Search } from "ui/components/search/Search"
import { useTheme } from "hooks/useTheme"

export const CardScreen = ({}: CardScreenTypes) => {
  const styles = useStyles()
  const { switchTheme } = useTheme()

  return (
    <View style={ styles.root }>
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
          <Search/>
        </SafeArea>
      </>
    </View>
  )
}
