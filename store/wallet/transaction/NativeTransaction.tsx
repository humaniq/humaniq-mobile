import React from "react";
import {
    _await,
    getSnapshot,
    model,
    Model,
    modelFlow,
    runUnprotected,
    timestampToDateTransform,
    tProp as p,
    types as t
} from "mobx-keystone"
import { action, computed, observable } from "mobx"
import { t as tr } from "../../../i18n"
import { formatEther } from "ethers/lib/utils"
import { Avatar, Colors } from "react-native-ui-lib"
import { BigNumber, ethers } from "ethers"
import { amountFormat, beautifyNumber, currencyFormat, preciseRound } from "../../../utils/number"
import dayjs from "dayjs";
import { renderShortAddress } from "../../../utils/address";
import { getAppStore, getEVMProvider, getWalletStore } from "../../../App";
import { localStorage } from "../../../utils/localStorage";
import { HIcon } from "../../../components/icon";
import { closeToast, setPendingAppToast } from "../../../utils/toast";
import { CircularProgress } from "../../../components/progress/CircularProgress";
import * as Sentry from "@sentry/react-native";
import { profiler } from "../../../utils/profiler/profiler";
import { EVENTS } from "../../../config/events";


export interface IEthereumTransactionConstructor {
    chainId: string
    nonce: string
    gasPrice: string
    gas: string
    value: string
    walletAddress: string
    toAddress: string
    fromAddress: string
    input: ""
    blockTimestamp: Date
    prices: {
        usd: number,
        eur?: number
    }
    type: number
}


export enum TRANSACTION_STATUS {
    PENDING = "",
    ERROR = "0",
    SUCCESS = "1",
    CANCELLING = "2",
    CANCELLED = "3",
}

@model("NativeTransaction")
export class NativeTransaction extends Model({
    walletAddress: p(t.string, ""),
    hash: p(t.string, ""),
    nonce: p(t.string, ""),
    transactionIndex: p(t.string, ""),
    toAddress: p(t.string, ""),
    fromAddress: p(t.string, ""),
    value: p(t.string, ""),
    input: p(t.string, ""),
    chainId: p(t.string, ""),
    receiptContractAddress: p(t.string, ""),
    receiptStatus: p(t.enum(TRANSACTION_STATUS), TRANSACTION_STATUS.PENDING),
    blockTimestamp: p(t.number).withTransform(timestampToDateTransform()),
    gas: p(t.string, ""),
    gasPrice: p(t.string, ""),
    prices: p(t.maybeNull(t.frozen(() => ({
        eur: t.number,
        usd: t.number,
        rub: t.number,
        cny: t.number,
        jpy: t.number,
        eth: t.number
    })))),
}) {

    @observable
    waitingTransactions

    wait = null

    @computed
    get txBody() {
        return {
            chainId: +this.chainId,
            nonce: +this.nonce,
            gasPrice: +this.gasPrice,
            gas: +this.gas,
            to: this.toAddress,
            from: this.fromAddress,
            value: BigNumber.from(this.value),
            type: 0,
            data: this.input
        }
    }

    @modelFlow
    * sendTransaction() {
        const id = profiler.start(EVENTS.SEND_TRANSACTION)
        try {
            const tx = (yield* _await(this.wallet.ether.sendTransaction(this.txBody))) as ethers.providers.TransactionResponse
            this.hash = tx.hash
            profiler.end(id)
            return tx
        } catch (e) {
            console.log("ERROR-SEND-TRANSACTION", e)
            Sentry.captureException(e)
            profiler.end(id)
            return false
        }
    }

    @modelFlow
    * waitTransaction() {
        const id = profiler.start(EVENTS.WAIT_TRANSACTION)
        try {
            getEVMProvider().jsonRPCProvider.once(this.hash, async (confirmedTx) => {
                const hash = this.hash
                await runUnprotected(async () => {
                    this.blockTimestamp = new Date()
                    this.transactionIndex = confirmedTx.transactionIndex
                    this.receiptContractAddress = confirmedTx.contractAddress
                    this.receiptStatus = TRANSACTION_STATUS.SUCCESS
                    // TODO: обработать обгон транзакции над перезаписываемой
                    getAppStore().toast.display = false
                    this.applyToWallet()
                    getEVMProvider().jsonRPCProvider.off(hash)
                })
            })
        } catch (e) {
            console.log("ERROR_WAIT_TRANSACTIONS", e)
        }
        profiler.end(id)
    }

    @action
    cancelTx = async () => {
        this.cancelTransaction.bind(this)
        await this.cancelTransaction()
    }

    @modelFlow
    * cancelTransaction() {
        if (this.receiptStatus === TRANSACTION_STATUS.PENDING && this.canRewriteTransaction) {
            const id = profiler.start(EVENTS.CANCEL_TRANSACTION)
            try {
                setPendingAppToast(tr("transactionScreen.cancelTransaction"))
                this.receiptStatus = TRANSACTION_STATUS.CANCELLING
                this.gasPrice = (this.gasPrice * 1.5).toFixed(0).toString()
                this.value = "0"
                this.toAddress = ethers.constants.AddressZero
                const tx = (yield* _await(this.wallet.ether.sendTransaction(this.txBody))) as ethers.providers.TransactionResponse
                yield this.removeFromStore()
                this.hash = tx.hash
                yield this.storeTransaction()
                getEVMProvider().jsonRPCProvider.once(tx.hash, async (confirmedTx) => {
                    console.log("cancelled-transaction")
                    await runUnprotected(async () => {
                        this.blockTimestamp = new Date()
                        this.transactionIndex = confirmedTx.transactionIndex
                        this.receiptContractAddress = confirmedTx.contractAddress
                        this.receiptStatus = TRANSACTION_STATUS.SUCCESS
                        await this.removeFromStore()
                        getEVMProvider().jsonRPCProvider.off(tx.hash)
                        closeToast()
                    })
                })
            } catch (e) {
                console.log("ERROR-CANCELLING-TRANSACTION", e)
                closeToast()
            }
            profiler.end(id)
        }
    }

    @action
    speedUpTx = async () => {
        this.speedUpTransaction.bind(this)
        await this.speedUpTransaction()
    }


    @modelFlow
    * speedUpTransaction() {
        if (this.receiptStatus === TRANSACTION_STATUS.PENDING && this.canRewriteTransaction) {
            const id = profiler.start(EVENTS.SPEED_UP_TRANSACTION)
            try {
                setPendingAppToast(tr("transactionScreen.speedUpTransaction"))
                this.gasPrice = (this.gasPrice * 1.5).toFixed(0).toString()
                const tx = (yield* _await(this.wallet.ether.sendTransaction(this.txBody))) as ethers.providers.TransactionResponse
                yield this.removeFromStore()
                this.hash = tx.hash
                yield this.storeTransaction()
                getEVMProvider().jsonRPCProvider.once(tx.hash, async (confirmedTx) => {
                    console.log("speed-up-transaction")
                    await runUnprotected(async () => {
                        this.blockTimestamp = new Date()
                        this.transactionIndex = confirmedTx.transactionIndex
                        this.receiptContractAddress = confirmedTx.contractAddress
                        this.receiptStatus = TRANSACTION_STATUS.SUCCESS
                        await this.removeFromStore()
                        getEVMProvider().jsonRPCProvider.off(tx.hash)
                        closeToast()
                    })
                })
            } catch (e) {
                console.log("ERROR-SPEED-UP-TRANSACTION", e)
                closeToast()
            }
            profiler.end(id)
        }
    }

    @modelFlow
    * storeTransaction() {
        const saveTx = getSnapshot(this)
        const transactions = (yield* _await(localStorage.load(`humaniq-pending-transactions-eth-${ this.chainId }-${ this.walletAddress }`))) || {}
        transactions[saveTx.hash] = saveTx
        _await(localStorage.save(`humaniq-pending-transactions-eth-${ this.chainId }-${ this.walletAddress }`, transactions))
    }

    @modelFlow
    * removeFromStore() {
        const transactions = (yield* _await(localStorage.load(`humaniq-pending-transactions-eth-${ this.chainId }-${ this.walletAddress }`))) || {}
        delete transactions[this.key]
        _await(localStorage.save(`humaniq-pending-transactions-eth-${ this.chainId }-${ this.walletAddress }`, transactions))
    }

    @modelFlow
    * applyToWallet() {
        try {
            this.storeTransaction()
            this.wallet.transactions.set(this.key, this)
        } catch (e) {
            console.log("ERROR-APPLY-TO-WALLET", e)
        }
    }

    @computed
    get key() {
        return this.hash
    }

    @computed
    get wallet() {
        return getWalletStore().walletsMap.get(this.walletAddress)
    }

    @computed
    get formatValue() {
        return `${ beautifyNumber(preciseRound(+formatEther(this.value))) }`
    }

    @computed
    get formatDate() {
        return dayjs(this.blockTimestamp).format("lll")
    }

    @computed
    get fiatValue() {
        return this.prices[getWalletStore().currentFiatCurrency] ? preciseRound(this?.prices[getWalletStore().currentFiatCurrency] * +formatEther(this.value)) : 0
    }

    @computed
    get formatFiatValue() {
        switch (this.action) {
            case 1:
                return `- ${ currencyFormat(this.fiatValue, getWalletStore().currentFiatCurrency) }`
            case 2:
                return `+ ${ currencyFormat(this.fiatValue, getWalletStore().currentFiatCurrency) }`
            default:
                return `${ currencyFormat(this.fiatValue, getWalletStore().currentFiatCurrency) }`
        }
    }

    @computed
    get formatFee() {
        return +formatEther((this.gasPrice * this.gas).toString())
    }

    @computed
    get canRewriteTransaction() {
        return +amountFormat(this.wallet.valBalance - this.formatFee * 1.5, 8) > 0
    }

    @computed
    get fiatFee() {
        return this.prices[getWalletStore().currentFiatCurrency] ? preciseRound(this?.prices[getWalletStore().currentFiatCurrency] * this.formatFee) : 0
    }

    @computed
    get formatTotal() {
        return +formatEther(this.value) + (+formatEther((this.gasPrice * this.gas).toString()))
    }

    @computed
    get fiatTotal() {
        return this.prices[getWalletStore().currentFiatCurrency] ? preciseRound(this?.prices[getWalletStore().currentFiatCurrency] * this.formatTotal) : 0
    }

    @computed
    get action() {
        switch (true) {
            case this.walletAddress === this.fromAddress && this.toAddress === ethers.constants.AddressZero && this.value === "0":
                return 5
            case this.walletAddress === this.fromAddress && this.value && this.input === "0x":
                return 1
            case this.walletAddress === this.toAddress && this.value && this.input === "0x":
                return 2
            case this.input !== "0x":
                return 3
            default:
                return 4
        }
    }

    @computed
    get title() {
        switch (true) {
            case this.action === 1:
                return renderShortAddress(this.toAddress)
            case this.action === 2:
                return renderShortAddress(this.fromAddress)
            case this.action === 3:
                return renderShortAddress(this.toAddress)
            case this.action === 4:
                return tr('transactionModel.action.undefined')
            case this.action === 5:
                return renderShortAddress(this.fromAddress)
        }
    }

    @computed
    get actionColor() {
        switch (true) {
            case this.receiptStatus === TRANSACTION_STATUS.PENDING:
            case this.receiptStatus === TRANSACTION_STATUS.CANCELLING:
                return Colors.warning
            case this.action === 5:
                return Colors.error
            default:
                return Colors.textGray
        }
    }

    @computed
    get valueColor() {
        switch (this.action) {
            case 2:
                return Colors.success
            default:
                return Colors.black
        }
    }

    @computed
    get statusIcon() {
        switch (true) {
            case this.receiptStatus === TRANSACTION_STATUS.PENDING:
            case this.receiptStatus === TRANSACTION_STATUS.CANCELLING:
                return <CircularProgress indeterminate strokeWidth={ 1 } radius={ 18 }>
                    <Avatar backgroundColor={ Colors.rgba(Colors.warning, 0.07) } size={ 36 }>
                        <HIcon name={ "clock-arrows" } size={ 20 } color={ Colors.warning }/></Avatar>
                </CircularProgress>
            case this.action === 5:
                return <Avatar backgroundColor={ Colors.rgba(Colors.error, 0.07) } size={ 36 }>
                    <HIcon name={ "warning" } size={ 20 } color={ Colors.error }/></Avatar>
            default:
                return <Avatar backgroundColor={ Colors.rgba(Colors.success, 0.07) } size={ 36 }>
                    <HIcon name={ "done" } size={ 20 } color={ Colors.success }/></Avatar>
        }
    }

    @computed
    get actionName() {
        switch (true) {
            case this.receiptStatus === TRANSACTION_STATUS.CANCELLING:
                return tr('transactionModel.action.cancelling')
            case this.receiptStatus === TRANSACTION_STATUS.PENDING:
                return tr('transactionModel.action.pending')
            case this.action === 1:
                return tr('transactionModel.action.outgoing')
            case this.action === 2:
                return tr('transactionModel.action.incoming')
            case this.action === 3:
                return tr('transactionModel.action.smartContract')
            case this.action === 5:
                return tr('transactionModel.action.reject')
            default:
                return tr('transactionModel.action.undefined')
        }
    }
}