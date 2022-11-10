import { noop } from "utils/common"

export interface PrimaryButtonProps {
  title: string
  onPress?: typeof noop
  disabled?: boolean
  style?: any
}
