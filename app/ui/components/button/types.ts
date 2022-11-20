import { noop } from "utils/common"
import { StyleProp, TextStyle, ViewStyle } from "react-native"

export interface PrimaryButtonProps {
  title?: string
  icon?: string
  onPress?: typeof noop
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  iconStyles?: {
    size?: number,
    color?: string
  }
}
