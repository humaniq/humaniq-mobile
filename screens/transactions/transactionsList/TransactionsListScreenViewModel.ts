import { getWalletStore } from "../../../App"
import { makeAutoObservable } from "mobx"


export class TransactionsListScreenViewModel {
  initialized = false
  currentWalletAddress
  tokenAddress = null
  refreshing = false

  get wallet() {
    return getWalletStore().walletsMap.get(this.currentWalletAddress)
  }

  get transactions() {
    console.log()
    return this.tokenAddress
        ? this.wallet.erc20.get(this.tokenAddress).transactionsList
        : this.wallet.transactionsList
  }

  get loadingTransactions() {
    return this.tokenAddress
        ? false
        : this.wallet.transactions.loading
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
      this.initialized = !!params.initialized
      if (!this.initialized) {
        if (this.tokenAddress) {
          await this.wallet.getERC20Transactions()
        } else {
          await this.wallet.loadTransactions(true)
        }
        this.initialized = true
      }
    } catch (e) {
      console.log("ERROR", e)
    }

  }

  constructor() {
    makeAutoObservable(this, null, { autoBind: true })
  }
}
