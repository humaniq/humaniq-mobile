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
import { Header } from "ui/components/header/Header"
import { LockText } from "ui/components/lock/LockText"
import { PrimaryButton } from "ui/components/button/PrimaryButton"

export const CardScreen = ({}: CardScreenTypes) => {
  const styles = useStyles()
  const { switchTheme } = useTheme()

  return (
    <>
      <AppStatusBar/>
      <SafeArea style={ styles.root }>
        <Header/>
        <View style={ styles.content }>
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
        <LockText text={ "Your data is securely stored by regulated Partner, not Mover." }/>
        <PrimaryButton title={ "Exxx dorogi" }/>
      </SafeArea>
    </>
  )
}
