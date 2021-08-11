import { createContext, Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone";
import { ProviderStore } from "../provider/ProviderStore";
import { WalletStore } from "../wallet/WalletStore";

export const appStore = createContext<AppStore>()

@model("AppStore")
export class AppStore extends Model({
  initialized: p(t.boolean, false)
}) {
  @modelFlow
  * init(provider: ProviderStore, wallet: WalletStore) {
    yield provider.eth.init()
    yield wallet.init()
    this.initialized = true
  }
}
