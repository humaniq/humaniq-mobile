import { Model, model, ModelAutoTypeCheckingMode, setGlobalConfig, tProp as p, types as t } from "mobx-keystone";
import { WalletStore } from "./wallet/WalletStore";
import { ProviderStore } from "./provider/ProviderStore";
import { AppStore } from "./app/AppStore";
import { RequestStore } from "./api/RequestStore";
import { ApiStore } from "./api/ApiStore";
import { DictionaryStore } from "./dictionary/DictionaryStore";

setGlobalConfig({
  modelAutoTypeChecking: ModelAutoTypeCheckingMode.AlwaysOff
});

@model("RootStore")
export class RootStore extends Model({
  initialized: p(t.boolean, false),
  requestStore: p(t.model<RequestStore>(RequestStore), () => new RequestStore({})),
  apiStore: p(t.model<ApiStore>(ApiStore), () => new ApiStore({})),
  dictionaryStore: p(t.model<DictionaryStore>(DictionaryStore), () => new DictionaryStore({})),
  appStore: p(t.model<AppStore>(AppStore), () => new AppStore({})),
  walletStore: p(t.model<WalletStore>(WalletStore), () => new WalletStore({})),
  providerStore: p(t.model<ProviderStore>(ProviderStore), () => new ProviderStore({}))
}) {

}
