import { SplashScreenProps } from "./types"
import { useStyles } from "./styles"
import { SafeArea } from "ui/components/SafeArea"
import React from "react"
import { AppStatusBar } from "ui/components/statusbar/AppStatusBar"

export const SplashScreen = ({}: SplashScreenProps) => {
  const styles = useStyles()

  return (
    <>
      <AppStatusBar/>
      <SafeArea style={ styles.root }>
      </SafeArea>
    </>
  )
}
