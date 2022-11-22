import { noop } from "utils/common"
import { ProviderType } from "../../../../references/providers"

export interface Props {
  visible: boolean
  onProviderPressed?: (selectedProviderId?: ProviderType) => void
  onTermsPressed?: typeof noop
  onStateChange?: (index: number) => void
  onDismiss?: typeof noop
}
