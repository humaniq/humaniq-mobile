import { StyleProp, ViewStyle } from "react-native"
import { noop } from "utils/common"
import { NetworkInfo } from "../../../../references/types"

export interface TokenItemProps {
  selected?: boolean
  style?: StyleProp<ViewStyle>
  onPress?: typeof noop
  item: NetworkInfo
}
