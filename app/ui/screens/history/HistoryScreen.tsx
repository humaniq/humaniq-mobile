import React from "react"
import { HistoryScreenTypes } from "./types"
import { useStyles } from "./styles"
import { AppStatusBar } from "ui/components/statusbar/AppStatusBar"
import { SafeArea } from "ui/components/SafeArea"

export const HistoryScreen = ({}: HistoryScreenTypes) => {
  const styles = useStyles()

  return (
    <>
      <AppStatusBar/>
      <SafeArea style={ styles.root }></SafeArea>
    </>
  )
}
