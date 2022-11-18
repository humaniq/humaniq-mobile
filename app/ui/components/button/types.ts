import { noop } from "utils/common"
import { StyleProp, ViewStyle } from "react-native"

export interface PrimaryButtonProps {
  title?: string
  icon?: string
  onPress?: typeof noop
  disabled?: boolean
  pending?: boolean
  style?: StyleProp<ViewStyle>
  iconStyles?: {
    size?: number,
    color?: string
  }
}
