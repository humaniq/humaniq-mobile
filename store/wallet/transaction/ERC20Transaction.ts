import { Model, model, prop, timestampToDateTransform, tProp as p, types as t } from "mobx-keystone";
import { computed } from "mobx";
import { formatUnits } from "@ethersproject/units/src.ts/index";
import { t as tr } from "../../../i18n";
import { Colors } from "react-native-ui-lib";
import { beautifyNumber, preciseRound } from "../../../utils/number";

@model("ERC20Transaction")
export class ERC20Transaction extends Model({
  decimals: prop<number>(8),
  symbol: prop<string>(""),
  transactionHash: prop<string>(""),
  address: prop<string>(""),
  blockTimestamp: prop<number>().withTransform(timestampToDateTransform()),
  blockNumber: prop<number>(0),
  blockHash: prop<string>(""),
  toAddress: prop<string>(""),
  fromAddress: prop<string>(""),
  value: prop<string>(""),
  chainId: p(t.string, ""),
  walletAddress: p(t.string, ""),
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
  get statusName() {
    return tr('transactionModel.status.success')
  }

  @computed
  get statusColor() {
    return Colors.primary
  }

  @computed
  get statusIcon() {
    return "check-circle"
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