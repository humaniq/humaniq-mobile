import { getWalletStore } from "../../../App"
import { makeAutoObservable } from "mobx"


export class TransactionsScreenViewModel {
  initialized = false
  currentWalletAddress
  tokenAddress = null
  refreshing = false

  get wallet() {
    return getWalletStore().allWallets.find(w => w.address === this.currentWalletAddress)
  }

  get transactions() {
    return this.tokenAddress
        ? this.wallet.erc20List.find(t => t.tokenAddress === this.tokenAddress).transactionsList
        : this.wallet.transactionsList
  }

  get token() {
    return this.tokenAddress
        ? this.wallet.erc20List.find(t => t.tokenAddress === this.tokenAddress) : {
          name: "Ethereum",
          symbol: "ETH",
          formatFiatBalance: this.wallet?.formatFiatBalance,
          formatBalance: this.wallet?.formatBalance
        }
  }

  async init(params) {
    try {
      this.currentWalletAddress = params.wallet
      this.tokenAddress = params.tokenAddress
      if (this.tokenAddress) {
        await this.wallet.getERC20Transactions()
      } else {
        await this.wallet.getWalletTransactions()
      }
      this.initialized = true
    } catch (e) {
      console.log("ERROR", e)
    }

  }

  constructor() {
    makeAutoObservable(this, null, { autoBind: true })
  }
}
