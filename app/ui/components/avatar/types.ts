import { StyleProp, ViewStyle } from "react-native"
import { noop } from "utils/common"

export interface AvatarProps {
  containerStyle?: StyleProp<ViewStyle>
  onPress?: typeof noop
}
