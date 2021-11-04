import React from "react";
import { Model, model, timestampToDateTransform, tProp as p, types as t } from "mobx-keystone";
import { computed } from "mobx";
import { formatUnits } from "@ethersproject/units/src.ts/index";
import { t as tr } from "../../../i18n";
import { Avatar, Colors } from "react-native-ui-lib";
import { beautifyNumber, preciseRound } from "../../../utils/number";
import dayjs from "dayjs";
import { renderShortAddress } from "../../../utils/address";
import FailIcon from "../../../assets/icons/warning.svg";
import DoneIcon from "../../../assets/icons/done.svg";
import PendingIcon from "../../../assets/icons/clock-arrows.svg";


@model("ERC20Transaction")
export class ERC20Transaction extends Model({
  walletAddress: p(t.string, ""),
  decimals: p(t.number, 8),
  nonce: p(t.string, ""),
  symbol: p(t.string, ""),
  transactionHash: p(t.string, ""),
  address: p(t.string, ""),
  blockTimestamp: p(t.string).withTransform(timestampToDateTransform()),
  blockNumber: p(t.number, 0),
  blockHash: p(t.string, ""),
  toAddress: p(t.string, ""),
  fromAddress: p(t.string, ""),
  value: p(t.string, ""),
  chainId: p(t.string, ""),
  receiptStatus: p(t.string, "1"),
  gas: p(t.string, ""),
  gasPrice: p(t.string, ""),
  prices: p(t.maybeNull(t.object(() => ({
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
      value: this.value,
      address: this.address
    }
  }

  wait = null

  @computed
  get key() {
    return this.transactionHash
  }

  @computed
  get hash() {
    return this.transactionHash
  }

  @computed
  get formatValue() {
    return `${ beautifyNumber(preciseRound(+formatUnits(this.value, this.decimals))) }`
  }

  @computed
  get formatDate() {
    return dayjs(this.blockTimestamp).format("lll")
  }

  @computed
  get fiatValue() {
    return this.prices?.usd ? preciseRound(this?.prices?.usd * +formatUnits(this.value, this.decimals)) : 0
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
  get action() {
    switch (true) {
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
    }
  }

  @computed
  get actionColor() {
    switch (true) {
      case this.receiptStatus === "":
        return Colors.warning
      case this.action === 4:
        return Colors.error
      default:
        return Colors.textGrey
    }
  }

  @computed
  get statusIcon() {
    switch (true) {
      case this.receiptStatus === "":
        return <Avatar backgroundColor={ Colors.rgba(Colors.warning, 0.07) } size={ 44 }>
          <PendingIcon width={ 22 } height={ 22 } color={ Colors.warning }/></Avatar>
      case this.action === 4:
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
      case  this.action === 2:
        return tr('transactionModel.action.incoming')
      default:
        return tr('transactionModel.action.undefined')
    }
  }
}