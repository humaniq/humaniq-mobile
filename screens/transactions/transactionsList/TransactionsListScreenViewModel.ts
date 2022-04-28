import { getEVMProvider, getWalletStore } from "../../../App"
import { makeAutoObservable } from "mobx"
import { Wallet } from "../../../store/wallet/Wallet";
import { capitalize } from "../../../utils/general";

export class TransactionsListScreenViewModel {
  initialized = false
  currentWalletAddress
  tokenAddress = null
  refreshing = false

  get wallet(): Wallet {
    return getWalletStore().walletsMap.get(this.currentWalletAddress)
  }

  get transactions() {
    return this.tokenAddress
        ? this.wallet.token.get(this.tokenAddress).transactionsList
        : this.wallet.transactionsList
  }

  get loadingTransactions() {
    return this.tokenAddress
        ? false
        : this.wallet.transactions.loading
  }

  get token() {
    return this.tokenAddress
        ? this.wallet.tokenList.find(t => t.tokenAddress === this.tokenAddress) : {
          name: capitalize(getEVMProvider().currentNetwork.nativeCoin),
          symbol: getEVMProvider().currentNetwork.nativeSymbol.toUpperCase(),
          formatFiatBalance: this.wallet?.formatFiatBalance,
          formatBalance: this.wallet?.formatBalance,
          tokenAddress: "",
          logo: getEVMProvider().currentNetwork.nativeCoin
        }
  }

  async init(params) {
    try {
      this.currentWalletAddress = params.wallet
      this.tokenAddress = params.tokenAddress
      this.initialized = !!params.initialized
      if (!this.initialized) {
        if (this.tokenAddress) {
          await this.wallet.getTokenTransactions()
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
