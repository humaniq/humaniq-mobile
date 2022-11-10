import { noop } from "utils/common"

export interface ThemeItemProps {
  selected?: boolean
  onPress?: typeof noop
  selectedIcon?: string
  title: string
  icon: string
}
