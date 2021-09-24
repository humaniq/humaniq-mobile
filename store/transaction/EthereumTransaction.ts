import { model, Model, prop, timestampToDateTransform, tProp as p, types as t } from "mobx-keystone"
import { computed } from "mobx"
import { t as tr } from "../../i18n"
import { formatEther } from "ethers/lib/utils"
import { Colors } from "react-native-ui-lib"


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
    blockTimestamp: prop<number>().withTransform(timestampToDateTransform())
}) {
    wait = null


    @computed
    get formatValue() {
        return `${ formatEther(this.value) } ETH`
    }

    @computed
    get statusName() {
        switch (this.receiptStatus) {
            case "0":
                return tr('transactionModel.status.fail')
            case "1":
                return tr('transactionModel.status.success')
            case "9":
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
            case "9":
                return Colors.yellow30
            default:
                return Colors.dark70
        }
    }

    @computed
    get statusIcon() {
        switch (this.receiptStatus) {
            case "0":
                return "times-circle"
            case "1":
                return "check-circle"
            case "9":
                return "clock"
            default:
                return "spinner"
        }
    }

    @computed
    get action() {
        switch (true) {
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
        }
    }
}
