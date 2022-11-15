import { PROVIDERS } from "./consts"
import { noop } from "utils/common"

export interface Props {
  visible: boolean
  onProviderPressed?: (selectedProviderId?: PROVIDERS) => void
  onTermsPressed?: typeof noop
  onStateChange?: (index: number) => void
  onDismiss?: typeof noop
}
