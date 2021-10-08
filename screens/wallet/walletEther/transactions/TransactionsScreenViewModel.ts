import { getWalletStore } from "../../../../App"
import { makeAutoObservable } from "mobx"


export class TransactionsScreenViewModel {
    initialized = false
    currentWalletAddress
    refreshing = false

    get wallet() {
        return getWalletStore().allWallets.find(w => w.address === this.currentWalletAddress)
    }

    async init(params) {
        try {
            this.currentWalletAddress = params.wallet
            await this.wallet.getWalletTransactions()
            this.initialized = true
        } catch (e) {
            console.log("ERROR", e)
        }

    }

    constructor() {
        makeAutoObservable(this, null, { autoBind: true })
    }
}
