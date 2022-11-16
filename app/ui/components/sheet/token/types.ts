import { noop } from "utils/common"

export interface Props {
  visible: boolean
  onStateChange?: (index: number) => void
  onDismiss?: typeof noop
}
