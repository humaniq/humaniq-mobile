import { createContext, Model, model, tProp as p, types as t } from "mobx-keystone";
import { EthereumProvider } from "./EthereumProvider";
import uuid from "react-native-uuid";

export const providerStore = createContext<ProviderStore>();

@model("ProviderStore")
export class ProviderStore extends Model({
  initialized: p(t.string, ""),
  eth: p(t.model<EthereumProvider>(EthereumProvider), () => new EthereumProvider({}))
}) {
  protected onInit() {
    this.initialized = uuid.v4();
  }
}
