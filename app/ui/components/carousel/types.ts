import { StyleProp, ViewStyle } from "react-native"
import { Network } from "../../../references/network"

export interface Props {
  header?: string
  containerStyle?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
  onPress?: (item: Network) => void
  networks?: Array<Network>;
}
