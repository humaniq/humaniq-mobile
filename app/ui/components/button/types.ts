import { noop } from "utils/common"
import { StyleProp, ViewStyle } from "react-native"

export interface PrimaryButtonProps {
  title?: string
  icon?: string
  onPress?: typeof noop
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}
