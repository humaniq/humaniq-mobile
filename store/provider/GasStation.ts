import { _await, getSnapshot, Model, model, modelFlow, runUnprotected, tProp as p, types as t } from "mobx-keystone";
import { ApisauceInstance, create } from "apisauce";
import { DEFAULT_API_CONFIG, GAS_STATION_ROUTES, GAS_STATION_URL } from "../../config/api";
import { computed, reaction } from "mobx";
import { getEVMProvider } from "../../App";
import { EVM_NETWORKS_NAMES } from "../../config/network";
import { ethers } from "ethers";
import { t as tr } from "../../i18n"

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
    selectedSpeed: p(t.enum(GAS_PRICE_SPEED), GAS_PRICE_SPEED.FAST).withSetter(),
    isError: p(t.boolean, false),
    pending: p(t.boolean, false)
}) {
    @computed
    get isBSC() {
        return getEVMProvider()?.currentNetworkName === EVM_NETWORKS_NAMES.BSC_TESTNET ||
            getEVMProvider()?.currentNetworkName === EVM_NETWORKS_NAMES.BSC
    }

    get fastFee() {
        return getEVMProvider().currentNetworkName === EVM_NETWORKS_NAMES.MAINNET ? this.fast : this.isBSC ? this.gasPrice : (this.gasPrice * 1.25).toFixed(0)
    }

    get fastestFee() {
        return getEVMProvider().currentNetworkName === EVM_NETWORKS_NAMES.MAINNET ? this.fastest : this.isBSC ? this.gasPrice : (this.gasPrice * 1.5).toFixed(0)
    }

    get safeLowFee() {
        return getEVMProvider().currentNetworkName === EVM_NETWORKS_NAMES.MAINNET ? this.safeLow : this.isBSC ? this.gasPrice : (this.gasPrice * 1).toFixed(0)
    }

    axios: ApisauceInstance;

    init() {
        this.axios = create({
            baseURL: GAS_STATION_URL,
            timeout: DEFAULT_API_CONFIG.timeout
        });
        reaction(() => this.enableAutoUpdate, (val) => {
            if (!val) return clearInterval(this.intId)
            this.update()
            this.intId = setInterval(() => {
                this.update()
            }, 15 * 1000)
        })
    }

    get selectedGasPrice() {
        switch (this.selectedSpeed) {
            case GAS_PRICE_SPEED.FAST:
                return this.fastFee
            case GAS_PRICE_SPEED.FASTEST:
                return this.fastestFee
            default:
                return this.safeLowFee
        }
    }

    get selectedGasPriceLabel() {
        switch (this.selectedSpeed) {
            case GAS_PRICE_SPEED.FAST:
                return tr("common.normal")
            case GAS_PRICE_SPEED.FASTEST:
                return tr("common.fast")
            default:
                return tr("common.low")
        }
    }

    @modelFlow
    * update() {
        try {
            if (!this.enableAutoUpdate) return null
            this.pending = true
            if (getEVMProvider().currentNetworkName === EVM_NETWORKS_NAMES.MAINNET) {
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
                this.gasPrice = (yield* _await(getEVMProvider().jsonRPCProvider.getGasPrice())).toString()
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