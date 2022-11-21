import { StyleProp, TextStyle, ViewStyle } from "react-native"

export interface SearchProps {
  hint?: string
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<TextStyle>
  onChangeText?: (text: string) => void
  loading?: boolean
}
