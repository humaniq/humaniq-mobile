import { makeAutoObservable } from "mobx";
import { getWalletStore } from "../../App";

export class VisibilityScreenViewModel {

    initialized = false
    visibleMode = true
    tokens = new Map()

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    init = async () => {
        getWalletStore().allWallets.forEach(w => {
            w.tokenList.forEach(t => this.tokens.set(t.symbol, t))
        })

        this.initialized = true
    }

    get countTokens() {
        return this.tokensList.length
    }

    get visibleTokensCount() {
        return this.tokensList.filter(t => t.show).length
    }

    get invisibleTokensCount() {
        return this.countTokens - this.visibleTokensCount
    }

    get tokensList() {
        return [ ...this.tokens.values() ]
    }
}