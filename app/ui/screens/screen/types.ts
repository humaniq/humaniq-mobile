import { StyleProp, ViewStyle } from "react-native"
import React from "react"

export interface ScreenProps {
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
}
