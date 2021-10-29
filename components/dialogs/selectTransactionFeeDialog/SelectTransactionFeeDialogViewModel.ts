import { makeAutoObservable } from "mobx";
import { t } from "../../../i18n";

export enum TRANSACTION_MULTIPLICATOR {
  SLOW = 1,
  NORMAL = 1.25,
  FAST = 1.5
}

export class SelectTransactionFeeDialogViewModel {

  display = false
  selected = TRANSACTION_MULTIPLICATOR.NORMAL

  get options(): any {
    return [
      {
        label: { name: t("common.slow"), icon: require("../../../assets/images/slow.png"), data: TRANSACTION_MULTIPLICATOR.SLOW },
        onPress: () => {
          this.selected = TRANSACTION_MULTIPLICATOR.SLOW
        },
        onOptionPress: () => {
          this.selected = TRANSACTION_MULTIPLICATOR.SLOW
        }
      },
      {
        label: { name: t("common.normal"), icon: require("../../../assets/images/clock.png"), data: TRANSACTION_MULTIPLICATOR.NORMAL },
        onPress: () => {
          this.selected = TRANSACTION_MULTIPLICATOR.NORMAL
        },
        onOptionPress: () => {
          this.selected = TRANSACTION_MULTIPLICATOR.NORMAL
        }
      },
      {
        label: { name: t("common.fast"), icon: require("../../../assets/images/fast.png"), data: TRANSACTION_MULTIPLICATOR.FAST },
        onPress: () => {
          this.selected = TRANSACTION_MULTIPLICATOR.FAST
        },
        onOptionPress: () => {
          this.selected = TRANSACTION_MULTIPLICATOR.FAST
        }
      }
    ]
  }

  constructor() {
    makeAutoObservable(this, null, { autoBind: true })
  }
}