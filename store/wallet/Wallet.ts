import {
    _await,
    fromSnapshot,
    getSnapshot,
    Model,
    model,
    modelFlow,
    objectMap,
    prop,
    runUnprotected,
    tProp as p,
    types as t
} from "mobx-keystone"
import { ethers, Signer } from "ethers"
import { computed, observable } from "mobx"
import { amountFormat, beautifyNumber, currencyFormat, preciseRound } from "../../utils/number"
import { v4 as uuidv4 } from 'uuid';
import { COINGECKO_ROUTES, MORALIS_ROUTES, ROUTES } from "../../config/api"
import { formatRoute } from "../../navigators"
import { getEVMProvider, getMoralisRequest, getRequest, getWalletStore } from "../../App"
import { NativeTransaction } from "./transaction/NativeTransaction"
import { changeCaseObj } from "../../utils/general"
import { Token } from "./token/Token"
import { TokenTransaction } from "./transaction/TokenTransaction";
import { NativeTransactionStore } from "./transaction/NativeTransactionStore";
import { localStorage } from "../../utils/localStorage";
import { InteractionManager } from "react-native";

export interface TransactionsRequestResult {
    page: number,
    // eslint-disable-next-line camelcase
    page_size: number
    total: number
    result: Array<any>
}

@model("Wallet")
export class Wallet extends Model({
    isError: prop<boolean>(false),
    pending: prop<boolean>(false).withSetter(),
    initialized: prop<string>("").withSetter(),
    address: prop<string>(""),
    name: prop<string>(""),
    balance: prop<string>(""),
    mnemonic: prop<string>(""),
    path: prop<string>(""),
    hdPath: prop<string>(""),
    privateKey: prop<string>(""),
    publicKey: prop<string>(""),
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
    transactions: p(t.model<NativeTransactionStore>(NativeTransactionStore), () => new NativeTransactionStore({})),
    token: p(t.objectMap(t.model<Token>(Token)), () => objectMap<Token>()),
    tokenTransactionsInitialized: p(t.boolean, false),
}) {

    @observable
    ether: Signer

    async init(force = false) {
        InteractionManager.runAfterInteractions(async () => {
            if (!this.initialized || force) {
                try {
                    // @ts-ignore
                    this.setPending(true)
                    this.ether = new ethers.Wallet(this.privateKey, getEVMProvider().jsonRPCProvider) // root.providerStore.eth.currenProvider || undefined);

                    await Promise.all([
                        this.updateBalanceFromProvider(),
                        // this.updateBalanceFromApi(),
                        this.getCoinCost(),
                        this.getTokenBalances()
                    ])
                } catch (e) {
                    console.log("ERROR", e)
                    this.isError = true
                } finally {
                    runUnprotected(() => {
                        this.initialized = uuidv4()
                        this.pending = false
                    })
                }
            }
        })
    }

    @modelFlow
    * updateBalanceFromProvider() {
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
            this.isError = true
        }
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
            this.isError = true
        }
    }

    @modelFlow
    * getCoinCost() {
        const cost = yield getRequest().get(COINGECKO_ROUTES.GET_TOKEN_PRICE, {
            ids: getEVMProvider().currentNetwork.nativeCoin,
            vs_currencies: "usd,eur,rub,cny,jpy,eth"
        })
        if (cost.ok) {
            this.prices = cost.data[getEVMProvider().currentNetwork.nativeCoin]
        } else {
            this.isError = true
        }
    }

    @modelFlow
    * loadTransactions(init = false) {
        try {
            if (!this.transactions.canLoad && !init) return
            if (init) {
                this.transactions.page = 0
                this.transactions.map.clear()
            }
            const route = formatRoute(MORALIS_ROUTES.ACCOUNT.GET_TRANSACTIONS, { address: this.address })
            this.transactions.loading = true

            const storedTransactions = (yield* _await(localStorage.load(`humaniq-pending-transactions-eth-${ getEVMProvider().currentNetwork.chainID }-${ this.address }`))) || []

            storedTransactions.forEach(t => {
                const pTx = fromSnapshot<NativeTransaction>(t)
                pTx.applyToWallet()
                pTx.waitTransaction()
            })

            const result = yield getMoralisRequest().get(route, {
                chain: `0x${ getEVMProvider().currentNetwork.networkID.toString(16) }`,
                offset: this.transactions.pageSize * this.transactions.page,
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
                this.transactions.total = result.data.total
                this.transactions.incrementOffset()
                this.transactions.loading = false
                this.transactions.initialized = true
            }
        } catch (e) {
            console.log("ER", e)
        }
    }

    @modelFlow
    * getTokenTransactions(init = false) {
        try {
            if (init) {
                this.tokenList.map(l => l.transactions.clear())
            }
            const route = formatRoute(MORALIS_ROUTES.ACCOUNT.GET_ERC20_TRANSFERS, {
                address: this.address
            })
            const result = yield getMoralisRequest().get(route, { chain: `0x${ getEVMProvider().currentNetwork.networkID.toString(16) }` })

            if (result.ok && (result.data as TransactionsRequestResult).total) {
                (result.data as TransactionsRequestResult).result.forEach(r => {

                    const currentToken = this.token.get(r.address)

                    const tr = new TokenTransaction({
                        ...changeCaseObj(r),
                        symbol: currentToken.symbol,
                        decimals: currentToken.decimals,
                        chainId: getEVMProvider().currentNetwork.chainID,
                        walletAddress: this.address.toLowerCase(),
                        blockTimestamp: new Date(r.block_timestamp),
                        prices: currentToken.prices
                    })
                    if (currentToken) {
                        runUnprotected(() => {
                            this.tokenTransactionsInitialized = true
                            currentToken.transactions.set(tr.transactionHash, tr)
                        })
                    }
                })
            }
        } catch (e) {
            console.log("ERROR", e)
        }
    }

    @modelFlow
    * getTokenBalances() {

        const route = formatRoute(MORALIS_ROUTES.ACCOUNT.GET_ERC20_BALANCES, {
            address: this.address
        })
        const erc20 = yield getMoralisRequest().get(route, { chain: `0x${ getEVMProvider().currentNetwork.networkID.toString(16) }` })
        if (erc20.ok) {
            erc20.data.forEach(t => {
                const erc20Token = new Token({ ...changeCaseObj(t), walletAddress: this.address })
                this.token.set(t.token_address, erc20Token)
                erc20Token.init()
            })
        } else {
            console.log("ERROR-GET-ERC20")
        }
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
