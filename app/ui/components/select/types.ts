import { StyleProp, ViewStyle } from "react-native"

export interface SelectProps {
  header?: string
  description?: string
  containerStyle?: StyleProp<ViewStyle>
  onItemClick?: (item: SelectItem) => void
  data: SelectItem[]
  placeholder?: string
  selectedValue?: SelectItem
}

export type SelectItem = {
  icon?: string
  title: string
  value: string
}
