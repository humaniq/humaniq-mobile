import { _await, createContext, getSnapshot, Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone";
import { ETH_NETWORKS, ETHEREUM_NETWORKS, PROVIDER_TYPE } from "../../config/network";
import { computed, reaction } from "mobx";
import * as storage from "../../utils/storage";
import { ethers } from "ethers";
import uuid from "react-native-uuid";

export const ethereumProvider = createContext<EthereumProvider>();

@model("EthereumProvider")
export class EthereumProvider extends Model({
  initialized: p(t.string, ""),
  pending: p(t.boolean, false),
  currentProviderType: p(t.enum(PROVIDER_TYPE), PROVIDER_TYPE.infura),
  currentNetworkName: p(t.enum(ETH_NETWORKS), ETH_NETWORKS.MAINNET)
}) {
  
  currentProvider;
  
  @computed
  get networks() {
    return ETHEREUM_NETWORKS;
  }
  
  @computed
  get currentNetwork() {
    return this.networks[this.currentNetworkName];
  }
  
  @modelFlow
  * init() {
    try {
      this.pending = true;
      switch (this.currentProviderType) {
        case PROVIDER_TYPE.infura:
          const network = yield* _await(storage.load("currentNetworkName"));
          this.currentNetworkName = network || this.currentNetworkName;
          this.currentProvider = ethers.getDefaultProvider(this.currentNetworkName, {
            infura: this.currentNetwork.infuraID
          });
          global.ethers = this.currentProvider;
          ethereumProvider.setDefault(this);
          break;
      }
      if (!this.initialized) {
        reaction(() => getSnapshot(this.currentNetworkName), (value) => {
          this.init();
        });
        reaction(() => getSnapshot(this.currentProviderType), (value) => {
          this.init();
        });
      }
      this.initialized = uuid.v4();
      this.pending = false;
    } catch (e) {
      console.log("catch", e);
    }
  }
}

@model("ProviderStore")
export class ProviderStore extends Model({
  initialized: p(t.boolean, false),
  eth: p(t.model<EthereumProvider>(EthereumProvider), () => new EthereumProvider({}))
}) {
}
