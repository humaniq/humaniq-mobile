import React from "react"
import { EarnScreenTypes } from "./types"
import { useStyles } from "./styles"
import { AppStatusBar } from "ui/components/statusbar/AppStatusBar"
import { SafeArea } from "ui/components/SafeArea"

export const EarnScreen = ({}: EarnScreenTypes) => {
  const styles = useStyles()

  return (
    <>
      <AppStatusBar/>
      <SafeArea style={ styles.root }></SafeArea>
    </>
  )
}
