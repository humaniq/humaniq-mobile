import { _await, getSnapshot, Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone"
import { EVM_NETWORKS_NAMES, EVM_NETWORKS } from "../../config/network"
import { computed, reaction } from "mobx"
import * as storage from "../../utils/localStorage"
import { ethers } from "ethers"
import { v4 as uuidv4 } from 'uuid';
import { GasStation } from "./GasStation";
import { JsonRpcProvider } from "@ethersproject/providers/src.ts/json-rpc-provider";
import { getEVMProvider } from "../../App";


@model("EVMProvider")
export class EVMProvider extends Model({
    initialized: p(t.string, ""),
    pending: p(t.boolean, false),
    currentNetworkName: p(t.enum(EVM_NETWORKS_NAMES), EVM_NETWORKS_NAMES.BSC).withSetter(),
    gasStation: p(t.model<GasStation>(GasStation), () => {
        const gs = new GasStation({});
        gs.init();
        return gs
    })
}) {

    jsonRPCProvider: JsonRpcProvider

    @computed
    get networks() {
        return EVM_NETWORKS
    }

    @computed
    get currentNetwork() {
        return this.networks[this.currentNetworkName]
    }

    @modelFlow
    * init() {
        try {
            console.log("init-provider")
            this.pending = true
            const network = yield* _await(storage.load("currentNetworkName"))
            this.currentNetworkName = network || this.currentNetworkName
            switch (this.currentNetworkName) {
                case EVM_NETWORKS_NAMES.BSC:
                    this.jsonRPCProvider = new ethers.providers.JsonRpcProvider({ url: "https://bsc-dataseed.binance.org" })
                    break
                case EVM_NETWORKS_NAMES.BSC_TESTNET:
                    this.jsonRPCProvider = new ethers.providers.JsonRpcProvider({ url: "https://data-seed-prebsc-1-s1.binance.org:8545" })
                    break
                default:
                    this.jsonRPCProvider = new ethers.providers.JsonRpcProvider({
                        url: `https://${ getEVMProvider().currentNetworkName }.infura.io/v3/${ this.currentNetwork.providerID }`,
                        user: this.currentNetwork.providerID,
                        password: this.currentNetwork.providerSecret
                    })
                    break
            }
            if (!this.initialized) {
                reaction(() => this.currentNetworkName, () => {
                    this.init()
                })
            }
            this.initialized = uuidv4()
            this.pending = false
        } catch (e) {
            console.log("catch", e)
        }
    }
}
