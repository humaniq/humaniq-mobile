import React from "react";
import { makeAutoObservable } from "mobx";
import { t } from "../../../i18n";
import SlowImage from "../../../assets/images/snail.svg"
import MediumImage from "../../../assets/images/clock.svg"
import FastImage from "../../../assets/images/fast.svg"

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
        label: {
          name: t("common.slow"),
          icon: <SlowImage width={ 20 } height={ 20 }/>,
          data: TRANSACTION_MULTIPLICATOR.SLOW
        },
        onPress: () => {
          this.selected = TRANSACTION_MULTIPLICATOR.SLOW
        },
        onOptionPress: () => {
          this.selected = TRANSACTION_MULTIPLICATOR.SLOW
        }
      },
      {
        label: {
          name: t("common.normal"),
          icon: <MediumImage width={ 20 } height={ 20 }/>,
          data: TRANSACTION_MULTIPLICATOR.NORMAL
        },
        onPress: () => {
          this.selected = TRANSACTION_MULTIPLICATOR.NORMAL
        },
        onOptionPress: () => {
          this.selected = TRANSACTION_MULTIPLICATOR.NORMAL
        }
      },
      {
        label: {
          name: t("common.fast"),
          icon: <FastImage width={ 20 } height={ 20 }/>,
          data: TRANSACTION_MULTIPLICATOR.FAST
        },
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