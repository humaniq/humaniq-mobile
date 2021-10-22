import { model, Model, timestampToDateTransform, tProp as p, types as t } from "mobx-keystone"
import { computed, observable } from "mobx"
import { t as tr } from "../../../i18n"
import { formatEther } from "ethers/lib/utils"
import { Colors } from "react-native-ui-lib"
import { ethers } from "ethers"
import { beautifyNumber, preciseRound } from "../../../utils/number"


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
  gas: p(t.string, ""),
  gasPrice: p(t.string, ""),
  chainId: p(t.number, ""),
  receiptContractAddress: p(t.string, ""),
  receiptStatus: p(t.string, ""),
  blockTimestamp: p(t.number).withTransform(timestampToDateTransform()),
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

  @observable
  wait = null

  @computed
  get formatValue() {
    return `${ beautifyNumber(preciseRound(+formatEther(this.value))) }`
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
  get statusName() {
    switch (this.receiptStatus) {
      case "0":
        return tr('transactionModel.status.fail')
      case "1":
        return tr('transactionModel.status.success')
      case "":
        return tr('transactionModel.status.process')
    }
  }

  @computed
  get statusColor() {
    switch (this.receiptStatus) {
      case "0":
        return Colors.purple40
      case "1":
        return Colors.primary
      case "":
        return Colors.yellow30
      default:
        return Colors.dark70
    }
  }

  @computed
  get statusIcon() {
    switch (this.receiptStatus) {
      case "0":
        return require("../../../assets/images/fail.png")
      case "1":
        return require("../../../assets/images/finger-up.png")
      case "":
        return require("../../../assets/images/sand-clocks.png")
      default:
        return require("../../../assets/images/clock.png")
    }
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
  get actionColor() {
    switch (this.action) {
      case 2:
        return Colors.success
      case 5:
        return Colors.error
      default:
        return Colors.black
    }
  }

  @computed
  get actionName() {
    switch (this.action) {
      case 1:
        return tr('transactionModel.action.outgoing')
      case 2:
        return tr('transactionModel.action.incoming')
      case 3:
        return tr('transactionModel.action.smartContract')
      case 4:
        return tr('transactionModel.action.undefined')
      case 5:
        return tr('transactionModel.action.reject')
    }
  }
}
