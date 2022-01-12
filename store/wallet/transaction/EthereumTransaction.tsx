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
import { amountFormat, beautifyNumber, preciseRound } from "../../../utils/number"
import dayjs from "dayjs";
import { renderShortAddress } from "../../../utils/address";
import { getAppStore, getEthereumProvider, getWalletStore } from "../../../App";
import { localStorage } from "../../../utils/localStorage";
import { HIcon } from "../../../components/icon";
import { closeToast, setPendingAppToast } from "./utils";


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

@model("EthereumTransaction")
export class EthereumTransaction extends Model({
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
    usd: t.number
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
      gasLimit: +this.gas,
      to: this.toAddress,
      from: this.fromAddress,
      value: BigNumber.from(this.value),
      type: 0,
      data: this.input
    }
  }

  @modelFlow
  * sendTransaction() {
    try {
      const tx = (yield* _await(this.wallet.ether.sendTransaction(this.txBody))) as ethers.providers.TransactionResponse
      this.hash = tx.hash
      return tx
    } catch (e) {
      console.log("ERROR-SEND-TRANSACTION", e)
      return false
    }
  }

  @modelFlow
  * waitTransaction() {
    console.log("wait-transaction")
    try {
      getEthereumProvider().currentProvider.once(this.hash, async (confirmedTx) => {
        const hash = this.hash
        console.log("mined-transaction")
        await runUnprotected(async () => {
          this.blockTimestamp = new Date()
          this.transactionIndex = confirmedTx.transactionIndex
          this.receiptContractAddress = confirmedTx.contractAddress
          this.receiptStatus = TRANSACTION_STATUS.SUCCESS
          // TODO: обработать обгон транзакции над перезаписываемой
          getAppStore().toast.display = false
          await this.applyToWallet()
          getEthereumProvider().currentProvider.off(hash)
        })
      })
    } catch (e) {
      console.log("ERROR_WAIT_TRANSACTIONS", e)
    }
  }

  @action
  cancelTx = async () => {
    this.cancelTransaction.bind(this)
    await this.cancelTransaction()
  }

  @modelFlow
  * cancelTransaction() {
    if (this.receiptStatus === TRANSACTION_STATUS.PENDING && this.canRewriteTransaction) {
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
        getEthereumProvider().currentProvider.once(tx.hash, async (confirmedTx) => {
          console.log("cancelled-transaction")
          await runUnprotected(async () => {
            this.blockTimestamp = new Date()
            this.transactionIndex = confirmedTx.transactionIndex
            this.receiptContractAddress = confirmedTx.contractAddress
            this.receiptStatus = TRANSACTION_STATUS.SUCCESS
            await this.removeFromStore()
            getEthereumProvider().currentProvider.off(tx.hash)
            closeToast()
          })
        })
      } catch (e) {
        console.log("ERROR-CANCELLING-TRANSACTION", e)
      }
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
      try {
        setPendingAppToast(tr("transactionScreen.speedUpTransaction"))
        this.gasPrice = (this.gasPrice * 1.5).toFixed(0).toString()
        const tx = (yield* _await(this.wallet.ether.sendTransaction(this.txBody))) as ethers.providers.TransactionResponse
        yield this.removeFromStore()
        this.hash = tx.hash
        yield this.storeTransaction()
        getEthereumProvider().currentProvider.once(tx.hash, async (confirmedTx) => {
          console.log("speed-up-transaction")
          await runUnprotected(async () => {
            this.blockTimestamp = new Date()
            this.transactionIndex = confirmedTx.transactionIndex
            this.receiptContractAddress = confirmedTx.contractAddress
            this.receiptStatus = TRANSACTION_STATUS.SUCCESS
            await this.removeFromStore()
            getEthereumProvider().currentProvider.off(tx.hash)
            closeToast()
          })
        })
      } catch (e) {
        console.log("ERROR-SPEED-UP-TRANSACTION", e)
      }
    }
  }

  @modelFlow
  * storeTransaction() {
    const saveTx = getSnapshot(this)
    const pendingTransactions = (yield* _await(localStorage.load(`humaniq-pending-transactions-eth-${ this.walletAddress }`))) || []
    pendingTransactions.push(saveTx)
    _await(localStorage.save(`humaniq-pending-transactions-eth-${ this.walletAddress }`, pendingTransactions))
  }

  @modelFlow
  * removeFromStore() {
    let pendingTransactions = (yield* _await(localStorage.load(`humaniq-pending-transactions-eth-${ this.walletAddress }`))) || []
    pendingTransactions = pendingTransactions.filter(t => t.hash !== this.key)
    _await(localStorage.save(`humaniq-pending-transactions-eth-${ this.walletAddress }`, pendingTransactions))
  }

  @modelFlow
  * applyToWallet() {
    try {
      if (this.receiptStatus === TRANSACTION_STATUS.PENDING || this.receiptStatus === TRANSACTION_STATUS.CANCELLING) {
        this.storeTransaction()
      } else {
        this.removeFromStore()
      }
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
    return this.prices?.usd ? preciseRound(this?.prices?.usd * +formatEther(this.value)) : 0
  }

  @computed
  get formatFiatValue() {
    switch (this.action) {
      case 1:
        return `-$${ this.fiatValue }`
      case 2:
        return `+$${ this.fiatValue }`
      default:
        return `$${ this.fiatValue }`
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
    return this.prices?.usd ? preciseRound(this?.prices?.usd * this.formatFee) : 0
  }

  @computed
  get formatTotal() {
    return +formatEther(this.value) + (+formatEther((this.gasPrice * this.gas).toString()))
  }

  @computed
  get fiatTotal() {
    return this.prices?.usd ? preciseRound(this?.prices?.usd * this.formatTotal) : 0
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
        return <Avatar backgroundColor={ Colors.rgba(Colors.warning, 0.07) } size={ 36 }>
          <HIcon name={ "clock-arrows" } size={ 20 } color={ Colors.warning }/></Avatar>
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
      case this.action === 4:
        return tr('transactionModel.action.undefined')
      case this.action === 5:
        return tr('transactionModel.action.reject')
    }
  }
}
