import { SettingsScreenProps } from "./types"
import { useStyles } from "./styles"
import { AppStatusBar } from "ui/components/statusbar/AppStatusBar"
import React from "react"
import { SafeArea } from "ui/components/SafeArea"
import { Header } from "ui/components/header/Header"
import { ThemeSettings } from "ui/components/theme/ThemeSettings"
import { Select } from "ui/components/select/Select"

export const SettingsScreen = ({}: SettingsScreenProps) => {
  const styles = useStyles()

  return (
    <>
      <AppStatusBar/>
      <SafeArea style={ styles.root }>
        <Header
          containerStyle={ styles.header }
          back={ false }
          title={ "Settings" }
        />
        <ThemeSettings/>
        <Select
          data={ [
            { title: "USD" },
            { title: "EUR" },
          ] }
          header={ "Base currency" }
          description={ "All assets, analytics and estimations will be displayed in this currency" }
        />
        <Select
          data={ [
            { title: "English" },
            { title: "Spanish" },
          ] }
          containerStyle={ styles.language }
          header={ "Language" }
        />
      </SafeArea>
    </>
  )
}
