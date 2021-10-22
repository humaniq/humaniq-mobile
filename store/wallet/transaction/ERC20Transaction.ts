import { Model, model, timestampToDateTransform, tProp as p, types as t } from "mobx-keystone";
import { computed } from "mobx";
import { formatUnits } from "@ethersproject/units/src.ts/index";
import { t as tr } from "../../../i18n";
import { Colors } from "react-native-ui-lib";
import { beautifyNumber, preciseRound } from "../../../utils/number";

@model("ERC20Transaction")
export class ERC20Transaction extends Model({
  decimals: p(t.number, 8),
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
  walletAddress: p(t.string, ""),
  prices: p(t.maybeNull(t.object(() => ({
    usd: t.number
  })))),
}) {
  @computed
  get nonce() {
    return this.transactionHash
  }

  @computed
  get formatValue() {
    return `${ beautifyNumber(preciseRound(+formatUnits(this.value, this.decimals))) }`
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
  get statusName() {
    return tr('transactionModel.status.success')
  }

  @computed
  get statusColor() {
    return Colors.primary
  }

  @computed
  get statusIcon() {
    return require("../../../assets/images/finger-up.png")
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
  get actionColor() {
    switch (this.action) {
      case 2:
        return Colors.success
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
      case 4:
        return tr('transactionModel.action.undefined')
    }
  }
}