import React from "react";
import {
    _await,
    getSnapshot,
    Model,
    model,
    modelFlow,
    runUnprotected,
    timestampToDateTransform,
    tProp as p,
    types as t
} from "mobx-keystone";
import { action, computed } from "mobx";
import { formatUnits } from "@ethersproject/units/src.ts/index";
import { t as tr } from "../../../i18n";
import { Avatar, Colors } from "react-native-ui-lib";
import { amountFormat, beautifyNumber, currencyFormat, preciseRound } from "../../../utils/number";
import dayjs from "dayjs";
import { renderShortAddress } from "../../../utils/address";
import { TRANSACTION_STATUS } from "./NativeTransaction";
import { BigNumber, ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { getAppStore, getEVMProvider, getWalletStore } from "../../../App";
import { contractAbiErc20 } from "../../../utils/abi";
import { localStorage } from "../../../utils/localStorage";
import { HIcon } from "../../../components/icon"
import { closeToast, setPendingAppToast } from "../../../utils/toast";
import { CircularProgress } from "../../../components/progress/CircularProgress";
import { profiler } from "../../../utils/profiler/profiler";
import { EVENTS, MARKETING_EVENTS } from "../../../config/events";
import { events } from "../../../utils/events";

@model("TokenTransaction")
export class TokenTransaction extends Model({
    walletAddress: p(t.string, ""),
    decimals: p(t.number, 8),
    nonce: p(t.string, ""),
    symbol: p(t.string, ""),
    transactionHash: p(t.string, ""),
    address: p(t.string, ""),
    blockTimestamp: p(t.string).withTransform(timestampToDateTransform()),
    blockNumber: p(t.string, ""),
    blockHash: p(t.string, ""),
    toAddress: p(t.string, ""),
    fromAddress: p(t.string, ""),
    value: p(t.string, ""),
    chainId: p(t.string, ""),
    receiptStatus: p(t.enum(TRANSACTION_STATUS), TRANSACTION_STATUS.SUCCESS),
    gas: p(t.string, ""),
    gasPrice: p(t.string, ""),
    prices: p(t.maybeNull(t.object(() => ({
        eur: t.number,
        usd: t.number,
        rub: t.number,
        cny: t.number,
        jpy: t.number,
        eth: t.number
    })))),
}) {

    wait = null

    @computed
    get txBody() {
        return {
            chainId: +this.chainId,
            nonce: +this.nonce,
            gasPrice: +this.gasPrice,
            gasLimit: +this.gas,
            to: this.toAddress,
            from: this.fromAddress,
            value: BigNumber.from(this.value),
            address: this.address,
            type: 0
        }
    }

    @modelFlow
    * sendTransaction() {
        const id = profiler.start(EVENTS.SEND_TRANSACTION)
        try {
            events.send(MARKETING_EVENTS.SENT_TRANSACTION)
            const contract = new ethers.Contract(this.address, contractAbiErc20, this.wallet.ether);
            const tx = (yield* _await(contract.transfer(this.txBody.to, this.value, {
                gasPrice: this.txBody.gasPrice,
                gasLimit: this.txBody.gasLimit,
                nonce: this.txBody.nonce,
                type: 0
            }))) as ethers.providers.TransactionResponse
            this.transactionHash = tx.hash
            profiler.end(id)
            return tx
        } catch (e) {
            console.log("ERROR-SEND-TRANSACTION", e)
            profiler.end(id)
            return null
        }
    }

    @modelFlow
    * waitTransaction() {
        const id = profiler.start(EVENTS.WAIT_TRANSACTION)
        try {
            getEVMProvider().jsonRPCProvider.once(this.hash, async (confirmedTx) => {
                const hash = this.hash
                await runUnprotected(async () => {
                    this.blockTimestamp = this.blockTimestamp || new Date()
                    this.receiptStatus = confirmedTx.status !== 0 ? TRANSACTION_STATUS.SUCCESS : TRANSACTION_STATUS.ERROR
                    // TODO: обработать обгон транзакции над перезаписываемой
                    if(this.receiptStatus === TRANSACTION_STATUS.SUCCESS) {
                        events.send(MARKETING_EVENTS.SENT_TRANSACTION_SUCCESSFUL)
                    }
                    getAppStore().toast.display = false
                    await this.applyToWallet()
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

                const tx = (yield* _await(this.wallet.ether.sendTransaction({
                    chainId: this.txBody.chainId,
                    nonce: this.txBody.nonce,
                    gasPrice: this.txBody.gasPrice,
                    gasLimit: this.txBody.gasLimit,
                    to: this.txBody.to,
                    from: this.txBody.from,
                    value: BigNumber.from(this.value),
                    type: 0
                }))) as ethers.providers.TransactionResponse

                yield this.removeFromStore()
                this.transactionHash = tx.hash
                yield this.storeTransaction()

                getEVMProvider().jsonRPCProvider.once(tx.hash, async (confirmedTx) => {
                    await runUnprotected(async () => {
                        this.blockTimestamp = new Date()
                        this.receiptStatus = TRANSACTION_STATUS.SUCCESS
                        await this.removeFromStore()
                        console.log({ canceled: confirmedTx })
                        getEVMProvider().jsonRPCProvider.off(tx.hash)
                        closeToast()
                    })
                })
            } catch (e) {
                console.log("ERROR-CANCELLING-TRANSACTION", e)
                getAppStore().toast.display = false
                yield this.removeFromStore()
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
                const contract = new ethers.Contract(this.address, contractAbiErc20, this.wallet.ether);
                const tx = (yield* _await(contract.transfer(this.txBody.to, this.value, {
                    gasPrice: this.txBody.gasPrice,
                    gasLimit: this.txBody.gasLimit,
                    nonce: this.txBody.nonce,
                    type: 0
                }))) as ethers.providers.TransactionResponse

                yield this.removeFromStore()
                this.transactionHash = tx.hash
                yield this.storeTransaction()

                getEVMProvider().jsonRPCProvider.once(tx.hash, async (confirmedTx) => {
                    console.log("speed-up-transaction")
                    await runUnprotected(async () => {
                        this.blockTimestamp = new Date()
                        this.receiptStatus = TRANSACTION_STATUS.SUCCESS
                        await this.removeFromStore()
                        getEVMProvider().jsonRPCProvider.off(tx.hash)
                        closeToast()
                    })
                })
            } catch (e) {
                console.log("ERROR-SPEED-UP-TRANSACTION", e)
            }
            profiler.end(id)
        }
    }

    @modelFlow
    * storeTransaction() {
        const saveTx = getSnapshot(this)
        const transactions = (yield* _await(localStorage.load(`humaniq-pending-transactions-token-${ this.chainId }-${ this.walletAddress }`))) || {}
        transactions[saveTx.transactionHash] = saveTx
        _await(localStorage.save(`humaniq-pending-transactions-token-${ this.chainId }-${ this.walletAddress }`, transactions))
    }

    @modelFlow
    * removeFromStore() {
        const transactions = (yield* _await(localStorage.load(`humaniq-pending-transactions-token-${ this.chainId }-${ this.walletAddress }`))) || {}
        delete transactions[this.key]
        _await(localStorage.save(`humaniq-pending-transactions-token-${ this.chainId }-${ this.walletAddress }`, transactions))
    }

    @modelFlow
    * applyToWallet() {
        try {
            this.storeTransaction()
            const currentToken = this.wallet.token.get(this.address)
            currentToken.transactions.set(this.key, this)
        } catch (e) {
            console.log("ERROR-APPLY-TO-WALLET", e)
        }
    }

    @computed
    get key() {
        return this.transactionHash
    }

    @computed
    get wallet() {
        return getWalletStore().walletsMap.get(this.walletAddress)
    }

    @computed
    get token() {
        return this.wallet.token.get(this.address)
    }

    @computed
    get hash() {
        return this.transactionHash
    }

    @computed
    get formatValue() {
        switch (this.action) {
            case 1:
                return `-${ beautifyNumber(preciseRound(+formatUnits(this.value, this.decimals))) } ${ this.symbol }`
            case 2:
                return `+${ beautifyNumber(preciseRound(+formatUnits(this.value, this.decimals))) } ${ this.symbol }`
            default:
                return `${ beautifyNumber(preciseRound(+formatUnits(this.value, this.decimals))) } ${ this.symbol }`
        }

    }

    @computed
    get formatDate() {
        return dayjs(this.blockTimestamp).format("MMM DD, hh:mm")
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
    get fiatValue() {
        return this.prices[getWalletStore().currentFiatCurrency] ? preciseRound(this.prices[getWalletStore().currentFiatCurrency] * +formatUnits(this.value, this.decimals)) : 0
    }

    @computed
    get formatFiatValue() {
        try {
            switch (this.action) {
                case 1:
                    return `- ${ currencyFormat(this.fiatValue, getWalletStore().currentFiatCurrency) }`
                case 2:
                    return `+ ${ currencyFormat(this.fiatValue, getWalletStore().currentFiatCurrency) }`
                default:
                    return `${ currencyFormat(this.fiatValue, getWalletStore().currentFiatCurrency) }`
            }
        } catch (e) {
            console.log(this.prices)
            console.log("ERROR", e)
            return "--/--"
        }
    }

    @computed
    get action() {
        switch (true) {
            case this.walletAddress === this.fromAddress && this.toAddress === ethers.constants.AddressZero && this.value === "0":
                return 5
            case this.walletAddress === this.fromAddress:
                return 1
            case this.walletAddress === this.toAddress:
                return 2
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
            case this.action === 4:
            case this.action === 5:
            case this.receiptStatus === TRANSACTION_STATUS.ERROR:
                return Colors.error
            default:
                return Colors.textGrey
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
                        <HIcon name={ "clock-arrows" } size={ 16 } color={ Colors.warning }/></Avatar>
                </CircularProgress>
            case this.action === 4:
            case this.action === 5:
            case this.receiptStatus === TRANSACTION_STATUS.ERROR:
                return <Avatar backgroundColor={ Colors.rgba(Colors.error, 0.07) } size={ 36 }>
                    <HIcon name={ "warning" } size={ 16 } color={ Colors.error }/>
                </Avatar>
            case this.action === 1:
                return <Avatar backgroundColor={ Colors.greyLight } size={ 36 }>
                    <HIcon name={ "arrow-to-top" } size={ 16 } color={ Colors.textGrey }/></Avatar>
            case this.action === 2:
                return <Avatar backgroundColor={ Colors.rgba(Colors.success, 0.07) } size={ 36 }>
                    <HIcon name={ "arrow-to-bottom" } size={ 16 } color={ Colors.success }/></Avatar>
            default:
                return <Avatar backgroundColor={ Colors.greyLight } size={ 36 }>
                    <HIcon name={ "document" } size={ 16 } color={ Colors.textGrey }/></Avatar>
        }
    }


    @computed
    get actionName() {
        switch (true) {
            case this.receiptStatus === TRANSACTION_STATUS.ERROR:
                return tr('transactionModel.action.error')
            case this.receiptStatus === TRANSACTION_STATUS.CANCELLING:
                return tr('transactionModel.action.cancelling')
            case this.receiptStatus === TRANSACTION_STATUS.PENDING:
                return tr('transactionModel.action.pending')
            case this.action === 1:
                return tr('transactionModel.action.outgoing')
            case  this.action === 2:
                return tr('transactionModel.action.incoming')
            case this.action === 5:
                return tr('transactionModel.action.reject')
            default:
                return tr('transactionModel.action.undefined')
        }
    }
}