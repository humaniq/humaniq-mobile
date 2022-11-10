import { StyleProp, ViewStyle } from "react-native"

export interface HeaderProps {
  title?: string
  isSettings?: boolean
  back?: boolean
  containerStyle?: StyleProp<ViewStyle>
}
