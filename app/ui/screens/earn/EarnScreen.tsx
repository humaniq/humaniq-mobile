import React from "react"
import { View } from "react-native"
import { EarnScreenTypes } from "./types"
import { useStyles } from "./styles"

export const EarnScreen = ({}: EarnScreenTypes) => {
  const styles = useStyles()

  return <View style={ styles.root }/>
}
