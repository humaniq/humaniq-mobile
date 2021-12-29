import { _await, getSnapshot, Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone"
import { ETH_NETWORKS, ETHEREUM_NETWORKS, PROVIDER_TYPE } from "../../config/network"
import { computed, reaction } from "mobx"
import * as storage from "../../utils/localStorage"
import { ethers } from "ethers"
import { v4 as uuidv4 } from 'uuid';
import { GasStation } from "./GasStation";
import { BaseProvider } from "@ethersproject/providers/src.ts/base-provider";
import { JsonRpcProvider } from "@ethersproject/providers/src.ts/json-rpc-provider";
import { getEthereumProvider } from "../../App";


@model("EthereumProvider")
export class EthereumProvider extends Model({
  initialized: p(t.string, ""),
  pending: p(t.boolean, false),
  currentProviderType: p(t.enum(PROVIDER_TYPE), PROVIDER_TYPE.infura),
  currentNetworkName: p(t.enum(ETH_NETWORKS), ETH_NETWORKS.MAINNET),
  gasStation: p(t.model<GasStation>(GasStation), () => {
    const gs = new GasStation({});
    gs.init();
    return gs
  })
}) {

  currentProvider: BaseProvider
  jsonRPCProvider: JsonRpcProvider

  @computed
  get networks() {
    return ETHEREUM_NETWORKS
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
      let network
      switch (this.currentProviderType) {
        case PROVIDER_TYPE.infura:
          network = yield* _await(storage.load("currentNetworkName"))
          this.currentNetworkName = network || this.currentNetworkName
          this.currentProvider = ethers.getDefaultProvider(this.currentNetworkName, {
            infura: {
              projectId: this.currentNetwork.infuraID,
              projectSecret: this.currentNetwork.infuraSecret
            }
          })
          this.jsonRPCProvider = new ethers.providers.JsonRpcProvider({
            url: `https://${ getEthereumProvider().currentNetworkName }.infura.io/v3/${ this.currentNetwork.infuraID }`,
            user: this.currentNetwork.infuraID,
            password: this.currentNetwork.infuraSecret
          })
          break
      }
      if (!this.initialized) {
        reaction(() => getSnapshot(this.currentNetworkName), () => {
          this.init()
        })
        reaction(() => getSnapshot(this.currentProviderType), () => {
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
