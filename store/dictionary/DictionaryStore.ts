import {
    _await,
    arraySet,
    fromSnapshot,
    getSnapshot,
    Model,
    model,
    modelFlow,
    objectMap,
    tProp as p,
    types as t
} from "mobx-keystone"
import { v4 as uuidv4 } from 'uuid';
import { create } from "apisauce";
import { API_FINANCE, FINANCE_ROUTES } from "../../config/api";
import { localStorage } from "../../utils/localStorage";
import { MONTH } from "../../config/common";
import { getEVMProvider, getWalletStore } from "../../App";
import { profiler } from "../../utils/profiler/profiler";
import { EVENTS } from "../../config/events";
import { reaction, toJS } from "mobx";
import { formatRoute } from "../../navigators";

export type Token = {
    addressHex: string
    symbol: string
    name: string
    decimals: number
    status: string
    hidden: boolean
    url: string
}

export type NetworkTokens = {
    [network: number]: {
        [token: string]: Token
    }
}

@model("DictionaryStore")
export class DictionaryStore extends Model({
    initialized: p(t.string, ""),
    token: p(t.unchecked<NetworkTokens>(), {}),
    recentlyUsedAddresses: p(t.arraySet(t.string), () => arraySet()),
    symbolsVisibility: p(t.objectMap(t.boolean), () => objectMap())
}) {

    @modelFlow
    * init() {
        const id = profiler.start(EVENTS.INIT_DICTIONARY_STORE)
        this.loadRecentlyUsedAddresses()
        yield this.loadSymbolsVisibility()

        reaction(() => getWalletStore().initialized, (val, prev) => {
            if (prev.length === 0) {
                console.log("load")
                this.loadTokenDictionary()
            }
        })
        reaction(() => getEVMProvider().initialized, (val, prev) => {
            if (prev !== "") {
                console.log("load")
                this.loadTokenDictionary()
            }
        })
        profiler.end(id)
    }

    @modelFlow
    * loadSymbolsVisibility() {
        const visibility = (yield* _await(localStorage.load("hm-wallet-symbols-visibility")))
        if (visibility !== null) {
            Object.entries(visibility).forEach(h => this.symbolsVisibility.set(h[0].toLowerCase(), h[1]))
        }
    }

    @modelFlow
    * toggleHideSymbol(token, show) {
        console.log({ token, show })
        console.log(this.currentTokenDictionary)
        // this.currentTokenDictionary[address].hide =
        // this.symbolsVisibility.set(symbol.toLowerCase(), show)
        yield* _await(localStorage.save("hm-wallet-symbols-visibility", toJS(this.symbolsVisibility.items)))
    }

    get networkTokensInitialized() {
        return !!this.currentTokenDictionary
    }

    get currentTokenDictionary() {
        return this.token[getEVMProvider().currentNetwork.chainID]
    }

    @modelFlow
    * loadTokenDictionary() {
        console.log("getTokenDictionary")
        if(this.networkTokensInitialized) return

        // yield* _await(localStorage.remove(`hm-wallet-tokens-update-${ getEVMProvider().currentNetwork.chainID }`))

        const last = (yield* _await(localStorage.load(`hm-wallet-tokens-update-${ getEVMProvider().currentNetwork.chainID }`)))
        const lastTokenUpdate = +last || Date.now() - (MONTH + 1)

        if (Date.now() - MONTH > lastTokenUpdate) {
            const axios = create({ baseURL: API_FINANCE })
            const res = yield* _await(axios.get<any>(formatRoute(FINANCE_ROUTES.GET_WALLET_LIST, {
                chainId: getEVMProvider().currentNetwork.chainID,
                walletAddress: getWalletStore().allWallets[0].address
            })))

            if (res.ok) {
                const tokensDic = (yield* _await(localStorage.load(`hm-wallet-tokens-dictionary`))) || {}
                tokensDic[getEVMProvider().currentNetwork.chainID] = res.data.payload
                this.token = tokensDic
                yield* _await(localStorage.save(`hm-wallet-tokens-update-${ getEVMProvider().currentNetwork.chainID }`, Date.now()))
                yield* _await(localStorage.save(`hm-wallet-tokens-dictionary`, toJS(tokensDic)))
            }
        } else {
            console.log("HERE")
            this.token = yield* _await(localStorage.load(`hm-wallet-tokens-dictionary`))
        }
        this.initialized = uuidv4()
    }

    @modelFlow
    * loadRecentlyUsedAddresses() {
        try {
            const addresses = (yield* _await(localStorage.load("hm-wallet-recently-addresses"))) || {}
            if (Object.keys(addresses).length) {
                this.recentlyUsedAddresses = fromSnapshot(addresses)
            }
        } catch (e) {
            console.log("ERROR", e)
            yield* _await(localStorage.save("hm-wallet-recently-addresses", {}))
            yield this.loadRecentlyUsedAddresses()
        }
    }

    @modelFlow
    * saveAddress(address: string) {
        try {
            if (getWalletStore().walletsMap.has(address)) return
            this.recentlyUsedAddresses.add(address)
            const snap = getSnapshot(this.recentlyUsedAddresses)
            yield* _await(localStorage.save("hm-wallet-recently-addresses", snap))
        } catch (e) {
            console.log("ERROR", e)
        }
    }
}
