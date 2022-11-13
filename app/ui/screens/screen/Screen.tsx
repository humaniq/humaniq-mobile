import { ScreenProps } from "./types"
import { useStyles } from "./styles"
import { AppStatusBar } from "ui/components/statusbar/AppStatusBar"
import React from "react"
import { SafeArea } from "ui/components/SafeArea"

export const Screen = ({ style, children }: ScreenProps) => {
  const styles = useStyles()

  return (
    <>
      <AppStatusBar/>
      <SafeArea style={ [styles.root, style] }>
        { children }
      </SafeArea>
    </>
  )
}
