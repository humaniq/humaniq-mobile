import { noop } from "utils/common"
import { StyleProp, ViewStyle } from "react-native"

export interface Props {
  onPress?: typeof noop
  containerStyle?: StyleProp<ViewStyle>
  token: any // TODO add type
}
