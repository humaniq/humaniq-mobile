import { Model, model, setGlobalConfig, tProp as p, types as t } from "mobx-keystone";
import { WalletStore } from "./WalletStore";
import { ProviderStore } from "./ProviderStore";

setGlobalConfig({
  // modelAutoTypeChecking: ModelAutoTypeCheckingMode.AlwaysOff,
})

@model("RootStore")
export class RootStore extends Model({
  initialized: p(t.boolean, false),
  walletStore: p(t.model<WalletStore>(WalletStore), () => new WalletStore({})),
  providerStore: p(t.model<ProviderStore>(ProviderStore), () => new ProviderStore({}))
}) {

}
