import { noop } from "utils/common"
import { StyleProp, ViewStyle } from "react-native"

export interface MovIconProps {
  name: string
  size?: number
  color?: string
  style?: StyleProp<ViewStyle>
}

export interface RoundedIconProps {
  icon: string
}

export interface TouchableIconProps {
  containerStyle?: StyleProp<ViewStyle>
  onPress?: typeof noop
  icon: string
  color: string
  size: number
}
