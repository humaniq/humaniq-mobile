import { _await, Model, model, modelFlow, objectMap, tProp as p, types as t } from "mobx-keystone"
import { ethers, Signer } from "ethers"
import { computed, observable } from "mobx"
import { amountFormat, currencyFormat } from "../../utils/number"
import uuid from "react-native-uuid"
import { ROUTES } from "../../config/api"
import { formatRoute } from "../../navigators"
import { getEthereumProvider, getRequest } from "../../App"
import { EthereumTransaction } from "../transaction/EthereumTransaction"

@model("Wallet")
export class Wallet extends Model({
    isError: p(t.boolean, false),
    pending: p(t.boolean, false),
    initialized: p(t.string, ""),
    address: p(t.string, ""),
    name: p(t.string, ""),
    balance: p(t.string, "0"),
    mnemonic: p(t.string, ""),
    path: p(t.string, ""),
    hdPath: p(t.string, ""),
    privateKey: p(t.string),
    publicKey: p(t.string),
    balances: p(t.maybeNull(t.object(() => ({
        // Address: t.string,
        amount: t.number,
        amountUnconfirmed: t.number,
        recomendedFee: t.number
        // Transactions: t.maybeNull(t.)
    })))),
    prices: p(t.maybeNull(t.object(() => ({
        eur: t.number,
        usd: t.number
    })))),
    // transactions: p(t.array(t.model<EthereumTransaction>(EthereumTransaction)), () => []),
    transactions:  p(t.objectMap(t.model<EthereumTransaction>(EthereumTransaction)), () => objectMap<EthereumTransaction>()),
}) {

    @observable
    ether: Signer

    @computed
    get isConnected() {
        return !!this.ether.provider
    }

    @computed
    get formatTransactions() {
        return Object.values<EthereumTransaction>(this.transactions.items).sort((a, b) => b.blockTimestamp - a.blockTimestamp)
    }

    @computed
    get formatAddress() {
        return this.address ? `${ this.address.slice(0, 4) }...${ this.address.substring(this.address.length - 4) }` : ""
    }

    @computed
    get ethBalance() {
        return this?.balances?.amount && +ethers.utils.formatEther(ethers.BigNumber.from(this.balances.amount.toString()))
    }

    @computed
    get formatBalance() {
        return amountFormat(this.ethBalance, 8)
    }

    @computed
    get fiatBalance() {
        return this.prices?.usd ? currencyFormat(this?.prices?.usd * this.ethBalance) : 0
    }

    @modelFlow
    * init(force = false) {
        if (!this.initialized || force) {
            try {
                this.pending = true
                this.ether = new ethers.Wallet(this.privateKey, getEthereumProvider().currentProvider) // root.providerStore.eth.currenProvider || undefined);

                getEthereumProvider().currentNetworkName !== 'mainnet' ?
                  yield this.updateBalanceFromProvider() :
                  yield this.updateBalanceFromApi()
                yield this.getCoinCost()
            } catch (e) {
                console.log("ERROR", e)
                this.isError = true
            } finally {
                this.initialized = uuid.v4()
                this.pending = false
            }
        }
    }

    @modelFlow
    * updateBalanceFromProvider() {
        try {
            const bn = yield* _await(this.ether.getBalance())
            this.balance = this.isConnected ? bn.toString() : this.balance
            this.balances = {
                amount: this.isConnected ? bn.toString() : this.balances.amount,
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
        const cost = yield getRequest().post(ROUTES.PRICES.GET_ALL_SUPPORT_COINS, {
            coins: [ "ethereum" ],
            withPrices: true
        })
        if (cost.ok) {
            this.prices = cost.data.items[0].prices
        } else {
            this.isError = true
        }
    }
}
