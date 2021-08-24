import { Model, model, ModelAutoTypeCheckingMode, setGlobalConfig, tProp as p, types as t } from "mobx-keystone"
import { WalletStore } from "./wallet/WalletStore"
import { ProviderStore } from "./provider/ProviderStore"
import { AppStore } from "./app/AppStore"
import { RequestStore } from "./api/RequestStore"
import { ApiStore } from "./api/ApiStore"
import { DictionaryStore } from "./dictionary/DictionaryStore"
import { AuthStore } from "./auth/AuthStore"
import { AuthRequestStore } from "./api/AuthRequestStore"
import {ProfileStore} from "./profile/ProfileStore";

setGlobalConfig({
  modelAutoTypeChecking: ModelAutoTypeCheckingMode.AlwaysOff
});

@model("RootStore")
export class RootStore extends Model({
  initialized: p(t.boolean, false),
  requestStore: p(t.model<RequestStore>(RequestStore), () => new RequestStore({})),
  authRequestStore: p(t.model<AuthRequestStore>(AuthRequestStore), () => new AuthRequestStore({})),
  apiStore: p(t.model<ApiStore>(ApiStore), () => new ApiStore({})),
  authStore: p(t.model<AuthStore>(AuthStore),() => new AuthStore({})),
  dictionaryStore: p(t.model<DictionaryStore>(DictionaryStore), () => new DictionaryStore({})),
  appStore: p(t.model<AppStore>(AppStore), () => new AppStore({})),
  walletStore: p(t.model<WalletStore>(WalletStore), () => new WalletStore({})),
  profileStore: p(t.model<ProfileStore>(ProfileStore), () => new ProfileStore({})),
  providerStore: p(t.model<ProviderStore>(ProviderStore), () => new ProviderStore({}))
}) {

}
