import { noop } from "utils/common"
import { StyleProp, ViewStyle } from "react-native"
import { TokenWithBalance } from "../../../references/tokens"

export interface Props {
  onPress?: typeof noop
  containerStyle?: StyleProp<ViewStyle>
  token: TokenWithBalance
}
