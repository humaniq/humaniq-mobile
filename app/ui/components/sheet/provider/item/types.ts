import React from "react"
import { noop } from "utils/common"
import { StyleProp, ViewStyle } from "react-native"

export interface ItemProps {
  title: string
  disabled?: boolean
  icon?: React.ReactNode
  onPress?: typeof noop
  style?: StyleProp<ViewStyle>
}
