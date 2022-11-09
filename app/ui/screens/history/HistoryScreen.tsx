import React from "react"
import { View } from "react-native"
import { HistoryScreenTypes } from "./types"
import { useStyles } from "./styles"

export const HistoryScreen = ({}: HistoryScreenTypes) => {
  const styles = useStyles()

  return <View style={ styles.root }/>
}
