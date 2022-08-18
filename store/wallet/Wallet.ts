import {
    _await,
    fromSnapshot,
    getSnapshot,
    Model,
    model,
    modelFlow,
    objectMap,
    runUnprotected,
    tProp as p,
    types as t
} from "mobx-keystone"
import * as Sentry from "@sentry/react-native";
import { ethers, Signer } from "ethers"
import { computed, observable, reaction, toJS } from "mobx"
import { amountFormat, beautifyNumber, currencyFormat, preciseRound } from "../../utils/number"
import { v4 as uuidv4 } from 'uuid';
import { API_FINANCE, COINGECKO_ROUTES, FINANCE_ROUTES, MORALIS_ROUTES, ROUTES } from "../../config/api"
import { formatRoute } from "../../navigators"
import { getDictionary, getEVMProvider, getMoralisRequest, getRequest, getWalletStore } from "../../App"
import { NativeTransaction, TRANSACTION_STATUS } from "./transaction/NativeTransaction"
import { changeCaseObj } from "../../utils/general"
import { Token } from "./token/Token"
import { TokenTransaction } from "./transaction/TokenTransaction";
import { NativeTransactionStore } from "./transaction/NativeTransactionStore";
import { localStorage } from "../../utils/localStorage";
import { InteractionManager } from "react-native";
import { profiler } from "../../utils/profiler/profiler";
import { EVENTS } from "../../config/events";
import { RequestStore } from "../api/RequestStore";
import { NATIVE_COIN } from "../../config/network";

export interface TransactionsRequestResult {
    page: number,
    // eslint-disable-next-line camelcase
    page_size: number
    total: number
    result: Array<any>
}

@model("Wallet")
export class Wallet extends Model({
    isError: p(t.boolean, false),
    pending: p(t.boolean, false).withSetter(),
    initialized: p(t.string, "").withSetter(),
    address: p(t.string, ""),
    name: p(t.string, ""),
    balance: p(t.string, ""),
    hidden: p(t.boolean, false).withSetter(),
    mnemonic: p(t.string, ""),
    path: p(t.string, ""),
    hdPath: p(t.string, ""),
    privateKey: p(t.string, ""),
    publicKey: p(t.string, ""),
    balances: p(t.maybeNull(t.object(() => ({
        amount: t.number,
        amountUnconfirmed: t.number,
        recomendedFee: t.number
    })))),
    prices: p(t.maybeNull(t.object(() => ({
        eur: t.number,
        usd: t.number,
        rub: t.number,
        cny: t.number,
        jpy: t.number,
        eth: t.number
    })))),
    history: p(t.array(t.object(() => ({ time: t.string, price: t.number }))), () => []),
    transactions: p(t.model<NativeTransactionStore>(NativeTransactionStore), () => new NativeTransactionStore({})),
    token: p(t.objectMap(t.model<Token>(Token)), () => objectMap<Token>()),
    tokenTransactionsInitialized: p(t.boolean, false),
}) {

    @observable
    ether: Signer

    apiFinance: RequestStore

    @modelFlow
    toggleHide = async () => {
        this.hidden = !this.hidden
        if (this.hidden) {
            getDictionary().hiddenSymbols.add(getEVMProvider().currentNetwork.nativeSymbol)
        } else {
            getDictionary().hiddenSymbols.delete(getEVMProvider().currentNetwork.nativeSymbol)
        }
    }

    async initWallet(force = false) {
        InteractionManager.runAfterInteractions(async () => {
            if (!this.initialized || force) {
                this.apiFinance = new RequestStore({})
                this.apiFinance.init(API_FINANCE)
                const id = profiler.start(EVENTS.INIT_WALLET)
                try {
                    // @ts-ignore
                    this.setPending(true)
                    this.ether = new ethers.Wallet(this.privateKey, getEVMProvider().jsonRPCProvider) // root.providerStore.eth.currenProvider || undefined);

                    await Promise.all([
                        this.updateBalanceFromProvider(),
                        this.getCoinCost(),
                        this.getTokenBalances()
                    ])

                    reaction(() => getWalletStore().showGraphBool, (val) => {
                        if (val) {
                            this.getTokenBalances()
                        }
                    })

                } catch (e) {
                    console.log("ERROR", e)
                    Sentry.captureException(e)
                    runUnprotected(() => {
                        this.isError = true
                    })
                } finally {
                    runUnprotected(() => {
                        this.initialized = uuidv4()
                        this.pending = false
                        profiler.end(id)
                    })
                }
            }
        })
    }

    @modelFlow
    * updateBalanceFromProvider() {
        const id = profiler.start(EVENTS.UPDATE_BALANCE_FROM_PROVIDER)
        try {
            const bn = yield* _await(this.ether.getBalance())
            this.balance = this.isConnected ? bn.toString() : this.balance
            this.balances = {
                amount: this.isConnected ? bn.toString() : this.balances?.amount,
                amountUnconfirmed: 0,
                recomendedFee: 0
            }
        } catch (e) {
            console.log("ERROR", e)
            Sentry.captureException(e)
            this.isError = true
        }
        profiler.end(id)
    }

    @modelFlow
    * updateBalanceFromApi() {
        const balances = yield getRequest().get(formatRoute(ROUTES.PRICES.GET_BALANCES_FOR_WALLET, {
            node: "eth",
            address: this.address
        }))
        if (balances.ok) {
            this.balances = balances.data.item
        } else {
            Sentry.captureException(balances)
            this.isError = true
        }
    }

    @modelFlow
    * getCoinCost() {
        const id = profiler.start(EVENTS.GET_COIN_COST)
        const cost = yield getRequest().get(COINGECKO_ROUTES.GET_TOKEN_PRICE, {
            ids: getEVMProvider().currentNetwork.nativeCoin,
            vs_currencies: "usd,eur,rub,cny,jpy,eth"
        })
        if (cost.ok) {
            this.prices = cost.data[getEVMProvider().currentNetwork.nativeCoin]
        } else {
            this.isError = true
            Sentry.captureException(cost?.problem?.origianalError)
        }
        profiler.end(id)
    }

    @modelFlow
    * loadTransactions(init = false) {
        const id = profiler.start(EVENTS.LOAD_TRANSACTIONS)
        try {
            if (!this.transactions.canLoad && !init) return
            if (init) {
                this.transactions.page = 0
                this.transactions.cursor = null
                this.transactions.map.clear()
            }
            const route = formatRoute(MORALIS_ROUTES.ACCOUNT.GET_TRANSACTIONS, { address: this.address })
            this.transactions.loading = true

            const storedTransactions = (yield* _await(localStorage.load(`humaniq-pending-transactions-eth-${ getEVMProvider().currentNetwork.chainID }-${ this.address }`))) || {}
            const transactionsArr = Object.values(storedTransactions)

            const result = yield getMoralisRequest().get(route, {
                chain: `0x${ getEVMProvider().currentNetwork.networkID.toString(16) }`,
                cursor: this.transactions.cursor,
                limit: this.transactions.pageSize
            })

            if (result.ok && (result.data as TransactionsRequestResult).total) {
                (result.data as TransactionsRequestResult).result.forEach(r => {
                    const tr = new NativeTransaction({
                        ...changeCaseObj(r),
                        chainId: getEVMProvider().currentNetwork.chainID,
                        walletAddress: this.address.toLowerCase(),
                        blockTimestamp: new Date(r.block_timestamp),
                        prices: getSnapshot(this.prices)
                    })
                    runUnprotected(() => {
                        this.transactions.map.set(tr.hash, tr)
                    })
                })

                transactionsArr.forEach(t => {
                    const pTx = fromSnapshot<NativeTransaction>(t)
                    const existTr = this.transactions.map.get(pTx.hash)
                    if (!existTr && pTx.hash) {
                        pTx.applyToWallet()
                        if (pTx.receiptStatus !== TRANSACTION_STATUS.ERROR) {
                            pTx.waitTransaction()
                        }
                    } else {
                        pTx.removeFromStore()
                    }
                })

                this.transactions.total = result.data.total
                this.transactions.cursor = result.data.cursor
                this.transactions.incrementOffset()
                this.transactions.loading = false
                this.transactions.initialized = true
            }
        } catch (e) {
            console.log("ERROR", e)
            Sentry.captureException(e)
        }
        profiler.end(id)
    }

    @modelFlow
    * getTokenTransactions(init = false, cursor?: string) {
        const id = profiler.start(EVENTS.LOAD_ERC20_TRANSACTIONS)
        try {
            if (init) {
                this.tokenList.map(l => l.transactions.clear())
            }
            const route = formatRoute(MORALIS_ROUTES.ACCOUNT.GET_ERC20_TRANSFERS, {
                address: this.address
            })

            const storedTransactions = (yield* _await(localStorage.load(`humaniq-pending-transactions-token-${ getEVMProvider().currentNetwork.chainID }-${ this.address }`))) || {}
            const result = yield getMoralisRequest().get(route, {
                chain: `0x${ getEVMProvider().currentNetwork.networkID.toString(16) }`,
                cursor
            })

            if (result.ok && (result.data as TransactionsRequestResult).total) {
                (result.data as TransactionsRequestResult).result.forEach(r => {

                    const currentToken = this.token.get(r.address)
                    let tr

                    try {
                        tr = new TokenTransaction({
                            ...changeCaseObj(r),
                            symbol: currentToken.symbol,
                            decimals: currentToken.decimals,
                            chainId: getEVMProvider().currentNetwork.chainID,
                            walletAddress: this.address.toLowerCase(),
                            blockTimestamp: new Date(r.block_timestamp),
                            prices: toJS(currentToken.prices)
                        })
                    } catch (e) {
                        console.log("ERROR", e)
                    }

                    if (currentToken) {
                        runUnprotected(() => {
                            if (!currentToken.transactions.has(tr.transactionHash)) {

                                currentToken.transactions.set(tr.transactionHash, tr)

                                const storedTx = storedTransactions[tr.transactionHash]
                                if (storedTx) {
                                    const pTx = fromSnapshot<TokenTransaction>(storedTx)
                                    pTx.removeFromStore()
                                    delete storedTransactions[tr.transactionHash]
                                }
                            }
                        })
                    }
                })

                const transactionsArr = Object.values(storedTransactions)
                transactionsArr.forEach(t => {
                    const pTx = fromSnapshot<TokenTransaction>(t)
                    if (pTx.hash) {
                        pTx.applyToWallet()
                        if (pTx.receiptStatus !== TRANSACTION_STATUS.ERROR) {
                            pTx.waitTransaction()
                        }
                    } else {
                        pTx.removeFromStore()
                    }
                })

                if (result.data.cursor) {
                    yield this.getTokenTransactions(false, result.data.cursor)
                }
                this.tokenTransactionsInitialized = true
            } else {
                // Sentry.captureException(result?.problem?.origianalError)
            }
        } catch (e) {
            console.log("ERROR", e)
            Sentry.captureException(e)
        }
        profiler.end(id)
    }

    @computed
    get graph() {
        const arr = this.history.map((p, i) => ({ y: p.price, x: i }))
        if (arr.length === 1 || (arr.length > 1 && arr[arr.length - 1].y === arr[arr.length - 2].y)) {
            arr.length && arr.push({ y: arr[arr.length - 1].y + 0.0001, x: arr[arr.length - 1].x + 1 })
        }
        return arr
    }

    @modelFlow
    * getTokenBalances() {
        const id = profiler.start(EVENTS.GET_TOKEN_BALANCES)
        const route = formatRoute(MORALIS_ROUTES.ACCOUNT.GET_ERC20_BALANCES, {
            address: this.address
        })
        const erc20 = yield getMoralisRequest().get(route, { chain: `0x${ getEVMProvider().currentNetwork.networkID.toString(16) }` })
        if (erc20.ok) {
            const result = yield* _await(this.apiFinance.get(FINANCE_ROUTES.GET_PRICES, {
                symbol: `${ erc20.data.map(t => t.symbol).join(",") },eth,bnb,hmq`,
                currency: "usd,eur,rub,cny,jpy,eth",
                history: "week",
                historyPrecision: 7
            }))
            if (result.ok) {
                this.history = getWalletStore().showGraphBool ? result.data.payload[getEVMProvider().currentNetwork.nativeCoin === NATIVE_COIN.ETHEREUM ? 'eth' : 'bnb'].usd.history : []
                erc20.data.forEach(t => {
                    try {
                        const erc20Token = Object.keys(result.data.payload[t.symbol.toLowerCase()]).length ?
                            new Token({
                                ...changeCaseObj(t),
                                walletAddress: this.address,
                                priceUSD: result.data.payload[t.symbol.toLowerCase()].usd.price,
                                priceEther: ethers.utils.parseEther(result.data.payload[t.symbol.toLowerCase()].eth.price.toString()).toString(),
                                history: getWalletStore().showGraphBool ? result.data.payload[t.symbol.toLowerCase()].usd.history : [],
                                hidden: getDictionary().hiddenSymbols.has(t.symbol.toLowerCase()),
                                prices: {
                                    eur: result.data.payload[t.symbol.toLowerCase()].eur.price,
                                    usd: result.data.payload[t.symbol.toLowerCase()].usd.price,
                                    rub: result.data.payload[t.symbol.toLowerCase()].rub.price,
                                    cny: result.data.payload[t.symbol.toLowerCase()].cny.price,
                                    jpy: result.data.payload[t.symbol.toLowerCase()].jpy.price,
                                    eth: result.data.payload[t.symbol.toLowerCase()].eth.price
                                }
                            }) :
                            new Token({
                                ...changeCaseObj(t),
                                walletAddress: this.address,
                                hidden: getDictionary().hiddenSymbols.has(t.symbol.toLowerCase()),
                                prices: {
                                    eur: 0,
                                    usd: 0,
                                    rub: 0,
                                    cny: 0,
                                    jpy: 0,
                                    eth: 0
                                }
                            })
                        this.token.set(t.token_address, erc20Token)
                        erc20Token.init()
                    } catch (e) {
                        console.log("ERROR", e)
                    }
                })
            }
        } else {
            console.log("ERROR-GET-ERC20", erc20)
            // Sentry.captureException(erc20?.problem?.origianalError)
        }
        profiler.end(id)
    }

    @computed
    get pendingTransaction() {
        return Object.values<NativeTransaction>(this.transactions).find(t => !t.receiptStatus)
    }

    @computed
    get isConnected() {
        return !!this.ether.provider
    }

    @computed
    get tokenList() {
        return Object.values<Token>(this.token.items)
    }

    @computed
    get transactionsList() {
        return this.transactions.list
    }

    @computed
    get formatAddress() {
        return this.address ? `${ this.address.slice(0, 4) }...${ this.address.substring(this.address.length - 4) }` : ""
    }

    @computed
    get valBalance() {
        return this?.balances?.amount ? preciseRound(+ethers.utils.formatEther(ethers.BigNumber.from(this.balances?.amount.toString()))) : 0
    }

    @computed
    get formatBalance() {
        return amountFormat(this.valBalance, 8)
    }

    @computed
    get fiatBalance() {
        try {
            return this.prices[getWalletStore().currentFiatCurrency] ? preciseRound(this.prices[getWalletStore().currentFiatCurrency] * this.valBalance) : 0
        } catch (e) {
            return 0
        }
    }

    @computed
    get formatFiatBalance() {
        return this.fiatBalance ? `${ beautifyNumber(+this.fiatBalance, getWalletStore().currentFiatCurrency) }` : `--/--`
    }

    @computed
    get totalWalletFiatBalance() {
        return this.fiatBalance + this.tokenList.reduce((acc, item) => {
            acc += item.fiatBalance
            return acc
        }, 0)
    }

    @computed
    get formatTotalWalletFiatBalance() {
        const currencyFormatted = currencyFormat(+this.totalWalletFiatBalance, getWalletStore().currentFiatCurrency)
        return currencyFormatted.length < 12 ?
            currencyFormatted :
            `${ beautifyNumber(+this.totalWalletFiatBalance, getWalletStore().currentFiatCurrency) }`
    }
}