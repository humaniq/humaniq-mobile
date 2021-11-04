import React from "react";
import { model, Model, timestampToDateTransform, tProp as p, types as t } from "mobx-keystone"
import { computed } from "mobx"
import { t as tr } from "../../../i18n"
import { formatEther } from "ethers/lib/utils"
import { Avatar, Colors } from "react-native-ui-lib"
import { ethers } from "ethers"
import { beautifyNumber, preciseRound } from "../../../utils/number"
import dayjs from "dayjs";
import PendingIcon from "../../../assets/icons/clock-arrows.svg"
import DoneIcon from "../../../assets/icons/done.svg"
import FailIcon from "../../../assets/icons/warning.svg"
import { renderShortAddress } from "../../../utils/address";


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
  chainId: p(t.number, ""),
  receiptContractAddress: p(t.string, ""),
  receiptStatus: p(t.string, ""),
  blockTimestamp: p(t.number).withTransform(timestampToDateTransform()),
  gas: p(t.string, ""),
  gasPrice: p(t.string, ""),
  prices: p(t.maybeNull(t.object(() => ({
    eur: t.number,
    usd: t.number
  })))),
}) {

  @computed
  get txBody() {
    return {
      chainId: +this.chainId,
      nonce: this.nonce,
      gasPrice: this.gasPrice,
      gasLimit: this.gas,
      to: this.toAddress,
      from: this.fromAddress,
      value: this.value
    }
  }

  wait = null

  @computed
  get key() {
    return this.nonce
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
    return +formatEther(this.gasPrice * this.gas)
  }

  @computed
  get fiatFee() {
    return this.prices?.usd ? preciseRound(this?.prices?.usd * this.formatFee) : 0
  }

  @computed
  get formatTotal() {
    return +formatEther(this.value) + (+formatEther(this.gasPrice * this.gas))
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
      case this.receiptStatus === "":
        return Colors.warning
      case this.action === 5:
        return Colors.error
      default:
        return Colors.textGray
    }
  }

  @computed
  get statusIcon() {
    switch (true) {
      case this.receiptStatus === "":
        return <Avatar backgroundColor={ Colors.rgba(Colors.warning, 0.07) } size={ 44 }>
          <PendingIcon width={ 22 } height={ 22 } color={ Colors.warning }/></Avatar>
      case this.action === 5:
        return <Avatar backgroundColor={ Colors.rgba(Colors.error, 0.07) } size={ 44 }>
          <FailIcon width={ 22 } height={ 22 } color={ Colors.error }/></Avatar>
      default:
        return <Avatar backgroundColor={ Colors.rgba(Colors.success, 0.07) } size={ 44 }>
          <DoneIcon width={ 22 } height={ 22 } color={ Colors.success }/></Avatar>
    }
  }

  @computed
  get actionName() {
    switch (true) {
      case this.receiptStatus === "":
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
