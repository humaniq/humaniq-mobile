import { makeAutoObservable } from "mobx";
import { getWalletStore } from "../../../App";
import { Wallet } from "../../../store/wallet/Wallet";

export class TransactionScreenViewModel {
  initialized = false
  currentWalletAddress
  tokenAddress = null
  transactionKey = null
  refreshing = false

  constructor() {
    makeAutoObservable(this, null, { autoBind: true })
  }

  async init(params) {
    this.currentWalletAddress = params.wallet
    this.tokenAddress = params.tokenAddress
    this.transactionKey = params.transactionKey
    this.initialized = true
  }

  get wallet(): Wallet {
    return getWalletStore().allWallets.find(w => w.address === this.currentWalletAddress)
  }

  get transaction() {
    return this.tokenAddress
        ? this.wallet.tokenList.find(t => t.tokenAddress === this.tokenAddress)?.transactions.get(this.transactionKey)
        : this.wallet?.transactions.map.get(this.transactionKey)
  }
}