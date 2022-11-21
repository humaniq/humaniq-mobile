import { StyleProp, ViewStyle } from "react-native"
import { noop } from "utils/common"
import { Network } from "../../../../references/network"

export interface CarouselItemProps {
  item: Network
  selected?: boolean
  style?: StyleProp<ViewStyle>
  onPress?: typeof noop
}
