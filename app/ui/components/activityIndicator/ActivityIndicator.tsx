import React from "react"
import { ActivityIndicator as AI } from "react-native-paper"
import { useStyles } from "./styles"
import { ActivityIndicatorProps } from "ui/components/activityIndicator/types"

export const ActivityIndicator = (props: ActivityIndicatorProps) => {
  const styles = useStyles()
  return <AI { ...props } color={ props.color || styles.root.color } />
}
