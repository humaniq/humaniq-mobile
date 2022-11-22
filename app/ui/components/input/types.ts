import { StyleProp, ViewProps } from "react-native"

export interface InputProps {
  title?: string
  placeholder?: string
  containerStyle?: any
  style?: StyleProp<ViewProps>
}

export interface MaskedInputProps {
  title?: string
  placeholder?: string
  containerStyle?: any
  style?: StyleProp<ViewProps>
  onChange?: (text: string, rawText: string) => void
  mask?: string
  loading?: boolean
}
