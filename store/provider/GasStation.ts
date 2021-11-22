import { _await, getSnapshot, Model, model, modelFlow, runUnprotected, tProp as p, types as t } from "mobx-keystone";
import { ApisauceInstance, create } from "apisauce";
import { DEFAULT_API_CONFIG, GAS_STATION_ROUTES, GAS_STATION_URL } from "../../config/api";
import { reaction } from "mobx";
import { getEthereumProvider } from "../../App";
import { ETH_NETWORKS } from "../../config/network";
import { ethers } from "ethers";

export enum GAS_PRICE_SPEED {
  FASTEST = 'FASTEST',
  FAST = 'FAST',
  SAFE_LOW = 'SAFE_LOW'
}

@model("GasStation")
export class GasStation extends Model({
  fast: p(t.number, 0),
  fastest: p(t.number, 0),
  safeLow: p(t.number, 0),
  fastWait: p(t.number, 5),
  fastestWait: p(t.number, 0.5),
  safeLowWait: p(t.number, 30),
  enableAutoUpdate: p(t.boolean, false).withSetter(),
  gasPrice: p(t.string, ""),
  intId: p(t.string, ""),
  selectedSpeed: p(t.enum(GAS_PRICE_SPEED), GAS_PRICE_SPEED.SAFE_LOW).withSetter(),
  isError: p(t.boolean, false),
  pending: p(t.boolean, false)
}) {

  get fastFee() {
    return getEthereumProvider().currentNetworkName === ETH_NETWORKS.MAINNET ? this.fast : this.gasPrice * 1.25
  }

  get fastestFee() {
    return getEthereumProvider().currentNetworkName === ETH_NETWORKS.MAINNET ? this.fastest : this.gasPrice * 1.5
  }

  get safeLowFee() {
    return getEthereumProvider().currentNetworkName === ETH_NETWORKS.MAINNET ? this.safeLow : this.gasPrice
  }

  axios: ApisauceInstance;

  init() {
    this.axios = create({
      baseURL: GAS_STATION_URL,
      timeout: DEFAULT_API_CONFIG.timeout
    });
    reaction(() => getSnapshot(this.enableAutoUpdate), (val) => {
      if (!val) return clearInterval(this.intId)
      this.update()
      this.intId = setInterval(() => {
        this.update()
      }, 15 * 1000)
    })
  }

  get selectedGasPrice() {
    if (getEthereumProvider().currentNetworkName === ETH_NETWORKS.MAINNET) {
      switch (this.selectedSpeed) {
        case GAS_PRICE_SPEED.FAST:
          return this.fast
        case GAS_PRICE_SPEED.FASTEST:
          return this.fastest
        default:
          return this.safeLow
      }
    } else {
      switch (this.selectedSpeed) {
        case GAS_PRICE_SPEED.FAST:
          return (this.gasPrice * 1.25).toFixed(0)
        case GAS_PRICE_SPEED.FASTEST:
          return (this.gasPrice * 1.50).toFixed(0)
        default:
          return this.gasPrice
      }
    }
  }

  @modelFlow
  * update() {
    try {
      if (!this.enableAutoUpdate) return null
      this.pending = true
      if (getEthereumProvider().currentNetworkName === ETH_NETWORKS.MAINNET) {
        const result = yield* _await(this.axios.get<any>(GAS_STATION_ROUTES.GET_GAS_FEE))
        if (result.ok) {
          this.isError = false
          this.fast = ethers.utils.parseUnits((result.data.fast / 10).toString(), 9).toString()
          this.fastest = ethers.utils.parseUnits((result.data.fastest / 10).toString(), 9).toString()
          this.safeLow = ethers.utils.parseUnits((result.data.safeLow / 10).toString(), 9).toString()
          this.fastWait = result.data.fastWait
          this.fastestWait = result.data.fastestWait
          this.safeLowWait = result.data.safeLowWait
        } else {
          this.isError = true
        }
      } else {
        const gasPrice = yield* _await(getEthereumProvider().currentProvider.getGasPrice())
        this.gasPrice = gasPrice.toString()
        this.isError = false
      }
    } catch (e) {
      this.isError = true
      console.log("ERROR", e)
    } finally {
      setTimeout(() => {
        runUnprotected(() => {
          this.pending = false
        })
      }, 2000)
    }
  }
}