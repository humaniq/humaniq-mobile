import { StyleProp, TextStyle } from "react-native"
import { noop } from "utils/common"

export interface PrimaryTextProps {
  text: string
  style?: StyleProp<TextStyle>
}

export interface LockTextProps {
  text: string
  icon: string
}

export interface LinkTextProps {
  text: string
  onPress?: typeof noop
}
