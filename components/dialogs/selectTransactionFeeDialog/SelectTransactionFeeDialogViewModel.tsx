import React from "react";
import { makeAutoObservable } from "mobx";
import { t } from "../../../i18n";
import SlowImage from "../../../assets/images/snail.svg"
import MediumImage from "../../../assets/images/clock.svg"
import FastImage from "../../../assets/images/fast.svg"
import { getEVMProvider, getWalletStore } from "../../../App";
import { GAS_PRICE_SPEED } from "../../../store/provider/GasStation";
import { ethers } from "ethers";
import { Wallet } from "../../../store/wallet/Wallet";

export class SelectTransactionFeeDialogViewModel {

  display = false
  wallet: string
  gasLimit = 21000

  get selectedSpeed() {
    return getEVMProvider().gasStation.selectedSpeed
  }

  get wa(): Wallet {
    return getWalletStore().walletsMap.get(this.wallet)
  }

  get options(): any {
    return [
      {
        label: {
          name: t("common.slow"),
          icon: <SlowImage width={ 20 } height={ 20 }/>,
          data: GAS_PRICE_SPEED.SAFE_LOW,
          time: getEVMProvider().gasStation.safeLowWait,
          fee: +ethers.utils.formatUnits(getEVMProvider().gasStation.safeLowFee * this.gasLimit, 18),
          feeFiat: +(ethers.utils.formatUnits(getEVMProvider().gasStation.safeLowFee * this.gasLimit, 18)) * this.wa?.prices[getWalletStore().currentFiatCurrency]
        },
        onPress: () => {
          getEVMProvider().gasStation.setSelectedSpeed(GAS_PRICE_SPEED.SAFE_LOW)
        },
        onOptionPress: () => {
          getEVMProvider().gasStation.setSelectedSpeed(GAS_PRICE_SPEED.SAFE_LOW)
        }
      },
      {
        label: {
          name: t("common.normal"),
          icon: <MediumImage width={ 20 } height={ 20 }/>,
          data: GAS_PRICE_SPEED.FAST,
          time: getEVMProvider().gasStation.fastWait,
          fee: +ethers.utils.formatUnits(getEVMProvider().gasStation.fastFee * this.gasLimit, 18),
          feeFiat: +ethers.utils.formatUnits(getEVMProvider().gasStation.fastFee * this.gasLimit, 18) * this.wa?.prices[getWalletStore().currentFiatCurrency]
        },
        onPress: () => {
          getEVMProvider().gasStation.setSelectedSpeed(GAS_PRICE_SPEED.FAST)
        },
        onOptionPress: () => {
          getEVMProvider().gasStation.setSelectedSpeed(GAS_PRICE_SPEED.FAST)
        }
      },
      {
        label: {
          name: t("common.fast"),
          icon: <FastImage width={ 20 } height={ 20 }/>,
          data: GAS_PRICE_SPEED.FASTEST,
          time: getEVMProvider().gasStation.fastestWait,
          fee: +ethers.utils.formatUnits(getEVMProvider().gasStation.fastestFee * this.gasLimit, 18),
          feeFiat: +ethers.utils.formatUnits(getEVMProvider().gasStation.fastestFee * this.gasLimit, 18) * this.wa?.prices[getWalletStore().currentFiatCurrency]
        },
        onPress: () => {
          getEVMProvider().gasStation.setSelectedSpeed(GAS_PRICE_SPEED.FASTEST)
        },
        onOptionPress: () => {
          getEVMProvider().gasStation.setSelectedSpeed(GAS_PRICE_SPEED.FASTEST)
        }
      }
    ]
  }

  constructor() {
    makeAutoObservable(this, null, { autoBind: true })
  }
}