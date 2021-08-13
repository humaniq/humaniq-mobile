import { Model, model, ModelAutoTypeCheckingMode, setGlobalConfig, tProp as p, types as t } from "mobx-keystone";
import { WalletStore } from "./wallet/WalletStore";
import { ProviderStore } from "./provider/ProviderStore";
import { AppStore } from "./app/AppStore";

setGlobalConfig({
  modelAutoTypeChecking: ModelAutoTypeCheckingMode.AlwaysOff
})

@model("RootStore")
export class RootStore extends Model({
  initialized: p(t.boolean, false),
  appStore: p(t.model<AppStore>(AppStore), () => new AppStore({})),
  walletStore: p(t.model<WalletStore>(WalletStore), () => new WalletStore({})),
  providerStore: p(t.model<ProviderStore>(ProviderStore), () => new ProviderStore({}))
}) {

}
