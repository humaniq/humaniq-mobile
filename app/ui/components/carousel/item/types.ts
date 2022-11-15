import { StyleProp, ViewStyle } from "react-native"
import { noop } from "utils/common"

export interface TokenItemProps {
  selected?: boolean
  style?: StyleProp<ViewStyle>
  onPress?: typeof noop
}
