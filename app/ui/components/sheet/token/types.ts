import { noop } from "utils/common"

export interface Props {
  visible: boolean
  onTermsPressed?: typeof noop
  onStateChange?: (index: number) => void
  onDismiss?: typeof noop
}
