import { createContext, Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone";
import { EthereumProvider } from "./EthereumProvider";

export const providerStore = createContext<ProviderStore>();

@model("ProviderStore")
export class ProviderStore extends Model({
  initialized: p(t.string, ""),
  eth: p(t.model<EthereumProvider>(EthereumProvider), () => new EthereumProvider({}))
}) {
  @modelFlow
  * init() {
    yield this.eth.init()
  }
}
