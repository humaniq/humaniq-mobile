import React from "react";
import { makeAutoObservable } from "mobx";
import { t } from "../../../i18n";
import SlowImage from "../../../assets/images/snail.svg"
import MediumImage from "../../../assets/images/clock.svg"
import FastImage from "../../../assets/images/fast.svg"
import { getEthereumProvider, getWalletStore } from "../../../App";
import { GAS_PRICE_SPEED } from "../../../store/provider/GasStation";
import { ethers } from "ethers";
import { Wallet } from "../../../store/wallet/Wallet";

export class SelectTransactionFeeDialogViewModel {

  display = false
  wallet: string
  gasLimit = 21000

  get selectedSpeed() {
    return getEthereumProvider().gasStation.selectedSpeed
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
          time: getEthereumProvider().gasStation.safeLowWait,
          fee: +ethers.utils.formatUnits(getEthereumProvider().gasStation.safeLowFee * this.gasLimit, 18),
          feeFiat: +(ethers.utils.formatUnits(getEthereumProvider().gasStation.safeLowFee * this.gasLimit, 18)) * this.wa?.prices.usd
        },
        onPress: () => {
          getEthereumProvider().gasStation.setSelectedSpeed(GAS_PRICE_SPEED.SAFE_LOW)
        },
        onOptionPress: () => {
          getEthereumProvider().gasStation.setSelectedSpeed(GAS_PRICE_SPEED.SAFE_LOW)
        }
      },
      {
        label: {
          name: t("common.normal"),
          icon: <MediumImage width={ 20 } height={ 20 }/>,
          data: GAS_PRICE_SPEED.FAST,
          time: getEthereumProvider().gasStation.fastWait,
          fee: +ethers.utils.formatUnits(getEthereumProvider().gasStation.fastFee * this.gasLimit, 18),
          feeFiat: +ethers.utils.formatUnits(getEthereumProvider().gasStation.fastFee * this.gasLimit, 18) * this.wa?.prices.usd
        },
        onPress: () => {
          getEthereumProvider().gasStation.setSelectedSpeed(GAS_PRICE_SPEED.FAST)
        },
        onOptionPress: () => {
          getEthereumProvider().gasStation.setSelectedSpeed(GAS_PRICE_SPEED.FAST)
        }
      },
      {
        label: {
          name: t("common.fast"),
          icon: <FastImage width={ 20 } height={ 20 }/>,
          data: GAS_PRICE_SPEED.FASTEST,
          time: getEthereumProvider().gasStation.fastestWait,
          fee: +ethers.utils.formatUnits(getEthereumProvider().gasStation.fastestFee * this.gasLimit, 18),
          feeFiat: +ethers.utils.formatUnits(getEthereumProvider().gasStation.fastestFee * this.gasLimit, 18) * this.wa?.prices.usd
        },
        onPress: () => {
          getEthereumProvider().gasStation.setSelectedSpeed(GAS_PRICE_SPEED.FASTEST)
        },
        onOptionPress: () => {
          getEthereumProvider().gasStation.setSelectedSpeed(GAS_PRICE_SPEED.FASTEST)
        }
      }
    ]
  }

  constructor() {
    makeAutoObservable(this, null, { autoBind: true })
  }
}