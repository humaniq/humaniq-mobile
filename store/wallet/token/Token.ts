import { Model, model, modelAction, modelFlow, objectMap, runUnprotected, tProp as p, types as t } from "mobx-keystone"
import { formatUnits } from "ethers/lib/utils"
import { beautifyNumber, preciseRound } from "../../../utils/number"
import { action, computed } from "mobx"
import { getDictionary, getWalletStore } from "../../../App";
import { TokenTransaction } from "../transaction/TokenTransaction";
import { ethers } from "ethers";
import { CURRENCIES } from "../../../config/common";


@model("Token")
export class Token extends Model({
    walletAddress: p(t.string, ""),
    initialized: p(t.boolean, false),
    pending: p(t.boolean, false),
    tokenAddress: p(t.string, ""),
    name: p(t.string, ""),
    symbol: p(t.string, ""),
    logo: p(t.string, ""),
    thumbnail: p(t.string, ""),
    decimals: p(t.string, ""),
    balance: p(t.string, ""),
    priceUSD: p(t.string, ""),
    priceEther: p(t.string, ""),
    transactions: p(t.objectMap(t.model<TokenTransaction>(TokenTransaction)), () => objectMap<TokenTransaction>()),
    history: p(t.array(t.object(() => ({ time: t.string, price: t.number }))), () => []),
    hidden: p(t.boolean, false).withSetter()
}) {

    @modelAction
    toggleHide = () => {
        this.hidden = !this.hidden
        getDictionary().toggleHideSymbol(this.symbol.toLowerCase(), this.hidden)
    }

    @computed
    get graph() {
        const arr = this.history.map((p, i) => ({ y: p.price, x: i }))
        if (arr.length === 1 || (arr.length > 1 && arr[arr.length - 1].y === arr[arr.length - 2].y)) {
            arr.length && arr.push({ y: arr[arr.length - 1].y + 0.0001, x: arr[arr.length - 1].x + 1 })
        }
        return arr
    }

    @computed
    get prices() {
        return this.priceEther ? {
            eur: getWalletStore().allWallets[0].prices[CURRENCIES.EUR] * Number(ethers.utils.formatEther(this.priceEther)) / getWalletStore().allWallets[0].prices.eth,
            usd: getWalletStore().allWallets[0].prices[CURRENCIES.USD] * Number(ethers.utils.formatEther(this.priceEther)) / getWalletStore().allWallets[0].prices.eth,
            rub: getWalletStore().allWallets[0].prices[CURRENCIES.RUB] * Number(ethers.utils.formatEther(this.priceEther)) / getWalletStore().allWallets[0].prices.eth,
            cny: getWalletStore().allWallets[0].prices[CURRENCIES.CNY] * Number(ethers.utils.formatEther(this.priceEther)) / getWalletStore().allWallets[0].prices.eth,
            jpy: getWalletStore().allWallets[0].prices[CURRENCIES.JPY] * Number(ethers.utils.formatEther(this.priceEther)) / getWalletStore().allWallets[0].prices.eth,
            eth: getWalletStore().allWallets[0].prices.eth
        } : { eur: 0, usd: 0, rub: 0, cny: 0, jpy: 0, eth: 0 }
    }

    @action
    async init() {
        try {
            runUnprotected(() => {
                getDictionary().ethTokenCurrentAddress.set(this.tokenAddress, this.symbol)
            })
        } catch (e) {
            console.log("ERROR", e)
        } finally {
            runUnprotected(() => {
                this.initialized = true
            })
        }
    }

    @computed
    get transactionsList() {
        return Object.values<TokenTransaction>(this.transactions.items).sort((a, b) => b.blockTimestamp - a.blockTimestamp)
    }

    @computed
    get valBalance() {
        return preciseRound(+formatUnits(this.balance, this.decimals).toString())
    }

    @computed
    get formatBalance() {
        return this.valBalance ? `${ beautifyNumber(this.valBalance) } ${ this.symbol }` : `--/--`
    }

    @computed
    get currentFiatPrice() {
        try {
            return this.priceEther ? getWalletStore().allWallets[0].prices[getWalletStore().currentFiatCurrency] / getWalletStore().allWallets[0].prices.eth * Number(ethers.utils.formatEther(this.priceEther)) : null
        } catch (e) {
            return 0
        }
    }

    @computed
    get fiatBalance() {
        return this.currentFiatPrice ? preciseRound(this.valBalance * this.currentFiatPrice) : null
    }

    @computed
    get formatFiatBalance() {
        return this.fiatBalance ? `${ beautifyNumber(+this.fiatBalance, getWalletStore().currentFiatCurrency) }` : `--/--`
    }
}