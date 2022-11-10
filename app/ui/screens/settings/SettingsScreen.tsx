import { SettingsScreenProps } from "./types"
import { useStyles } from "./styles"
import { AppStatusBar } from "ui/components/statusbar/AppStatusBar"
import React from "react"
import { SafeArea } from "ui/components/SafeArea"
import { Header } from "ui/components/header/Header"
import { ThemeSettings } from "ui/components/theme/ThemeSettings"

export const SettingsScreen = ({}: SettingsScreenProps) => {
  const styles = useStyles()

  return (
    <>
      <AppStatusBar/>
      <SafeArea style={ styles.root }>
        <Header
          containerStyle={ styles.header }
          back={ false }
          title={ "Settings" }/>
        <ThemeSettings/>
      </SafeArea>
    </>
  )
}
