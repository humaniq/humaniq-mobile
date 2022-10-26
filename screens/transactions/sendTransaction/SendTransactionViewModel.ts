import { makeAutoObservable, reaction, toJS } from "mobx";
import { Wallet } from "../../../store/wallet/Wallet";
import { getDictionary, getEVMProvider, getWalletStore } from "../../../App";
import { Token } from "../../../store/wallet/token/Token";
import { inject } from "react-ioc";
import {
    SelectWalletTokenViewModel
} from "../../../components/dialogs/selectWalletTokenDialog/SelectWalletTokenViewModel";
import { getSnapshot } from "mobx-keystone";
import { BigNumber, ethers } from "ethers";
import { currencyFormat } from "../../../utils/number";
import { NativeTransaction, TRANSACTION_STATUS } from "../../../store/wallet/transaction/NativeTransaction";
import {
    SelectTransactionFeeDialogViewModel
} from "../../../components/dialogs/selectTransactionFeeDialog/SelectTransactionFeeDialogViewModel";
import { isValidAddress } from "ethereumjs-util/dist/account";
import { t } from "../../../i18n";
import { RootNavigation } from "../../../navigators";
import { CommonActions } from "@react-navigation/native";
import { contractAbiErc20 } from "../../../utils/abi";
import { TokenTransaction } from "../../../store/wallet/transaction/TokenTransaction";
import { capitalize, throttle } from "../../../utils/general";
import { NATIVE_COIN_SYMBOL } from "../../../config/network";
import { profiler } from "../../../utils/profiler/profiler";
import { EVENTS } from "../../../config/events";
import * as Sentry from "@sentry/react-native";

export class SendTransactionViewModel {

    display = false
    pending = false
    updating = false
    pendingTransaction = false
    initialized = false
    walletAddress = ""
    tokenAddress = ""
    symbol = getEVMProvider().currentNetwork.nativeSymbol.toUpperCase()
    isMaxSettled = false
    inputFiat = false
    contract

    betweenMyAddress = false
    recentlyUsedAddresses = false

    txData = {
        chainId: 0,
        nonce: undefined,
        value: "",
        to: "",
        gasLimit: 21000,
    }

    txError = false
    message = ""

    inputRef = null

    selectWalletTokenDialog = inject(this, SelectWalletTokenViewModel)
    selectTransactionFeeDialog = inject(this, SelectTransactionFeeDialogViewModel)

    changeTokenAddress = reaction(() => this.selectWalletTokenDialog.tokenAddress, async (val) => {
        this.updating = true
        this.txData.value = ""
        this.tokenAddress = Object.values(NATIVE_COIN_SYMBOL).includes(val.toLowerCase() as NATIVE_COIN_SYMBOL) ? "" : val
        this.inputFiat = false
        await this.getTransactionData()
        if (this.tokenAddress && !this.wallet.tokenTransactionsInitialized) {
            await this.wallet.getTokenTransactions()
        } else if (!this.wallet.transactions.initialized) {
            await this.wallet.loadTransactions()
        }
        this.updating = false
    })

    changeReceiverAddress = reaction(() => this.txData.to, async (val) => {
        this.updating = true
        this.txData.to = val
        this.inputFiat = false
        await this.getTransactionData()
        this.updating = false
    })

    changeTokenValue = reaction(() => this.txData.value, throttle(async () => {
        this.updating = true
        try {
            const lastVal = this.parsedValue
            const result = this.tokenAddress && this.txData.to ? +((await this.contract.estimateGas.transfer(this.txData.to, this.fullValue))) : 21000
            if (lastVal === this.parsedValue) {
                this.txData.gasLimit = result
            }
        } catch (e) {
            console.log("ERROR-estimate-gas", e)
        } finally {
            this.updating = false
        }
    }, 100))

    get wallet(): Wallet {
        return getWalletStore().walletsMap.get(this.walletAddress)
    }


    get selectedGasPrice() {
        return +getEVMProvider().gasStation.selectedGasPrice
    }

    get selectedGasPriceLabel() {
        return getEVMProvider().gasStation.selectedGasPriceLabel
    }

    async init(route) {
        this.isMaxSettled = false
        this.tokenAddress = route?.tokenAddress
        this.walletAddress = route?.walletAddress
        this.txData.to = route?.to
        if (!this.initialized) {
            await this.getTransactionData();

            if (this.tokenAddress) {
                this.wallet.getTokenTransactions()
            } else {
                this.wallet.loadTransactions(true)
            }
            this.initialized = true
        }
    }

    registerInput(inputRef) {
        this.inputRef = inputRef
    }

    async getTransactionData() {
        const id = profiler.start(EVENTS.GET_TRANSACTION_DATA)
        try {
            this.pending = true
            this.txData.chainId = getEVMProvider().currentNetwork.chainID
            if (this.tokenAddress) {
                this.contract = new ethers.Contract(this.tokenAddress, contractAbiErc20, this.wallet.ether);
            }

            const [ nonce, gasLimit ] = await Promise.all([
                getEVMProvider().jsonRPCProvider.getTransactionCount(this.wallet.address, "pending"),
                this.tokenAddress && this.txData.to && this.contract.estimateGas.transfer(this.txData.to, this.fullValue)
            ])
            this.txData.nonce = nonce
            this.txData.gasLimit = gasLimit && +(gasLimit.toString()) || 21000
            this.pending = false
        } catch (e) {
            console.log("ERROR-get-transaction-data", e)
        }
        profiler.end(id)
    }

    setMaxValue() {
        try {
            if (Object.values(NATIVE_COIN_SYMBOL).includes(this.token.symbol.toLowerCase())) {
                this.txData.value = this.inputFiat ? ((this.wallet.valBalance - this.transactionFee) * this.price).toFixed(2).toString() : (this.wallet.valBalance - this.transactionFee).toFixed(6).toString()
            } else {
                this.txData.value = this.inputFiat ? (this.token.valBalance * this.price).toFixed(2).toString() : this.token.valBalance.toFixed(6).toString()
            }
            this.isMaxSettled = true
        } catch (e) {
            console.log("ERROR-set-max-value", e)
        }
    }

    get price() {
        return this.token.prices[getWalletStore().currentFiatCurrency]
    }

    get transactionMaxFee() {
        try {
            return +ethers.utils.formatUnits(+this.selectedGasPrice * this.txData.gasLimit, 18)
        } catch (e) {
            console.log("ERROR-fee", e)
            return 0
        }
    }

    get transactionFee() {
        try {
            return +ethers.utils.formatUnits(+this.selectedGasPrice * this.txData.gasLimit, 18)
        } catch (e) {
            console.log("ERROR", e)
            return 0
        }
    }

    get transactionFiatFee() {
        return this.transactionFee * this.wallet?.prices[getWalletStore().currentFiatCurrency]
    }

    get parsedValue() {
        try {
            return Number(this.txData.value) ? this.inputFiat ? (Number(this.txData.value) / this.price).toFixed(6).toString() : Number(this.txData.value).toString() : "0"
        } catch (e) {
            return "0"
        }
    }

    get parsedPrice() {
        try {
            return Number(this.txData.value) ? this.inputFiat ? (Number(this.txData.value) / this.price).toFixed(6).toString() : (Number(this.txData.value) * this.price).toFixed(2).toString() : "0"
        } catch (e) {
            console.log("ERROR-parsed-price", e)
            return "0"
        }
    }

    swapInputType() {
        if (this.isSwapEnable) {
            this.txData.value = this.parsedPrice !== "0" ? Number(this.parsedPrice).toFixed(this.inputFiat ? 6 : 2).toString() : ""
            this.inputFiat = !this.inputFiat
        }
    }

    get txHumanReadable() {
        return {
            value: this.parsedValue,
            valueFiat: this.parsedValue ? currencyFormat(+this.parsedValue * this.price, getWalletStore().currentFiatCurrency) : currencyFormat(0, getWalletStore().currentFiatCurrency),
            feeMax: this.transactionMaxFee,
            fee: this.transactionFee,
            feeFiat: currencyFormat(this.transactionFee * this.wallet?.prices[getWalletStore().currentFiatCurrency], getWalletStore().currentFiatCurrency),
            totalFiat: currencyFormat(+this.parsedValue * this.price + this.transactionFee * this.wallet?.prices[getWalletStore().currentFiatCurrency], getWalletStore().currentFiatCurrency),
            maxAmount: this.parsedValue ? (+this.parsedValue) + this.transactionMaxFee : 0,
            total: this.isNativeSelected ? `${ (+this.transactionFee + (+this.parsedValue)) } ${ this.token.symbol.toUpperCase() }` :
                `${ this.parsedValue } ${ this.token.symbol } + ${ this.transactionFee } ${ getEVMProvider().currentNetwork.nativeSymbol.toUpperCase() }`
        }
    }

    get enoughFee() {
        try {
            return this.wallet.balances?.amount ? BigNumber.from(this.wallet.balances?.amount)
                .gte(BigNumber.from(this.txData.gasLimit * +this.selectedGasPrice)
                ) : false
        } catch (e) {
            console.log("ERROR-enough-balance", e)
            return false
        }
    }

    get isNativeSelected() {
        return Object.values(NATIVE_COIN_SYMBOL).includes(this.token.symbol.toLowerCase())
    }

    get enoughBalance() {
        if (!this.enoughFee) return false
        if (this.isMaxSettled) return true
        try {
            if (this.isNativeSelected) {
                return this.wallet.balances?.amount ? BigNumber.from(this.wallet.balances?.amount)
                    .gte(BigNumber.from(this.fullValue).add(
                            BigNumber.from(this.txData.gasLimit * +this.selectedGasPrice)
                        )
                    ) : false
            } else {
                return this.wallet.balances?.amount ? BigNumber.from(this.token.balance)
                        .gte(BigNumber.from(this.fullValue)) &&
                    BigNumber.from(this.wallet.balances?.amount)
                        .gt(BigNumber.from(this.txData.gasLimit * +this.selectedGasPrice)) : false
            }
        } catch (e) {
            console.log("ERROR-enough-balance", e)
            return false
        }
    }

    get inputAddressError() {
        return this.txData.to && !isValidAddress(this.txData.to)
    }

    get inputAddressErrorMessage() {
        return this.inputAddressError ?
            t("selectAddressScreen.inputMessageError") :
            !this.txData.to ? t("selectAddressScreen.inputMessage") : ""
    }

    get isTransferAllow() {
        try {
            return !(!this.wallet?.balances?.amount || !this.parsedValue || !this.enoughBalance);
        } catch (e) {
            console.log("ERROR-transfer-allow", e)
            return false
        }
    }

    get fullValue() {
        return this.isMaxSettled ?
            this.isNativeSelected ?
                (BigNumber.from(this.wallet?.balances.amount).sub(BigNumber.from(this.txData.gasLimit * +this.selectedGasPrice))).toString() :
                this.token.balance :
            ethers.utils.parseUnits(this.parsedValue, this.token.decimals).toString()
    }

    get txBody() {
            const baseBody = {
                chainId: this.txData.chainId.toString(),
                nonce: this.txData.nonce.toString(),
                gasPrice: this.selectedGasPrice.toString(),
                gas: this.txData.gasLimit.toString(),
                value: this.fullValue,
                walletAddress: this.wallet.address,
                toAddress: this.txData.to,
                fromAddress: this.wallet?.address,
                input: "0x",
                blockTimestamp: new Date(),
                prices: toJS(this.token.prices),
                type: 0
            }

            return !this.tokenAddress ? baseBody : {
                ...baseBody,
                decimals: this.token?.decimals,
                address: this.tokenAddress,
                symbol: this.token?.symbol,
                receiptStatus: TRANSACTION_STATUS.PENDING
            }
    }

    sendTx = async () => {
        try {
            if (this.pendingTransaction) return

            setTimeout(() => {
                this.pendingTransaction = true
            }, 10)

            const tx = !this.tokenAddress ?
                new NativeTransaction(this.txBody) :
                new TokenTransaction(this.txBody)
            await tx.sendTransaction()
            tx.applyToWallet()
            setTimeout(() => {
                tx.waitTransaction()
                getDictionary().saveAddress(tx.toAddress)
                this.isMaxSettled = false
                this.closeDialog()
            }, 10)

            RootNavigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        {
                            name: "walletsList",
                        },
                        {
                            name: "walletTransactions",
                            params: {
                                wallet: this.wallet.address,
                                tokenAddress: this.tokenAddress,
                                initialized: true
                            }
                        }
                    ]
                })
            )

        } catch (e) {
            this.txError = true
            console.log("ERROR-send-tx", e)
            Sentry.captureException(e)
        } finally {
            this.pendingTransaction = false
        }
    }

    closeDialog = () => {
        // if (this.pendingTransaction) return
        this.initialized = false
        this.txData = {
            chainId: 0,
            gasLimit: 0,
            nonce: "",
            value: "",
            to: "",
        }
        this.pendingTransaction = false
        getEVMProvider().gasStation.setEnableAutoUpdate(false)
        this.display = false
    }

    get inputTitle() {
        return this.inputFiat ? getWalletStore().currentFiatCurrency.toUpperCase() : this.token.symbol
    }

    get inputPrice() {
        return this.inputFiat ? this.token.symbol : getWalletStore().currentFiatCurrency.toUpperCase()
    }

    get isSwapEnable() {
        return this.token?.fiatBalance !== null
    }

    get token(): Token | any {
        return this.tokenAddress
            ? this.wallet.tokenList.find(t => t.tokenAddress === this.tokenAddress) : {
                name: capitalize(getEVMProvider().currentNetwork.nativeCoin),
                symbol: getEVMProvider().currentNetwork.nativeSymbol.toUpperCase(),
                formatFiatBalance: this.wallet?.formatFiatBalance,
                formatBalance: this.wallet?.formatBalance,
                logo: getEVMProvider().currentNetwork.nativeCoin,
                fiatBalance: this.wallet?.fiatBalance,
                decimals: 18,
                priceUSD: this.wallet?.prices.usd,
                prices: getSnapshot(this.wallet?.prices)
            }
    }

    constructor() {
        makeAutoObservable(this, null, { autoBind: true })
    }
}
