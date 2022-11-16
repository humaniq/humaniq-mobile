import { noop } from "utils/common"
import { StyleProp, ViewStyle } from "react-native"

export interface RoundedIconProps {
  icon: string
}

export interface MIconProps {
  containerStyle?: StyleProp<ViewStyle>
  onPress?: typeof noop
  icon: string
  color: string
  size: number
}
