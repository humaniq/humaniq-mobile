import { Network } from "../references/network"
import { ExplorerSettings } from "./types"
import { addSentryBreadcrumb } from "../logs/sentry"
import { TokenWithBalance } from "../references/tokens"
import { moverAssetsService } from "../controllers/services/MoverAssets"

export class Explorer {

  protected readonly sentryCategoryPrefix = "explorer"
  protected readonly currentAccount: string
  protected readonly confirmSignature: string
  protected readonly availableNetworks: Array<Network>

  constructor(settings: ExplorerSettings) {
    this.currentAccount = settings.currentAccount
    this.confirmSignature = settings.confirmSignature
    this.availableNetworks = settings.availableNetworks
  }

  public getTokens = async (): Promise<TokenWithBalance[]> => {

    try {
      return await moverAssetsService.getMultiChainWalletTokens(
        this.currentAccount,
        this.confirmSignature,
      )
    } catch (error) {
      addSentryBreadcrumb({
        type: "error",
        message: "Mover wallet server error, use frontend fallback",
        category: this.sentryCategoryPrefix,
        data: {
          error: error,
        },
      })
    }
  }

}
