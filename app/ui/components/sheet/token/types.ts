import { noop } from "utils/common"
import { TokenWithBalance } from "../../../../references/tokens"
import { Network } from "../../../../references/network"

export interface Props {
  visible: boolean
  onStateChange?: (index: number) => void
  onDismiss?: typeof noop
  forceAssets?: Array<TokenWithBalance>
  forceNetworks?: Array<Network>;
  onTokenPress?: (selectedToken: TokenWithBalance) => void
}
