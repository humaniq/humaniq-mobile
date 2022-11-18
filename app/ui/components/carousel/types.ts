import { StyleProp, ViewStyle } from "react-native"
import { NetworkInfo } from "../../../references/types"

export interface Props {
  containerStyle?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
  onPress?: (item: NetworkInfo) => void
}
