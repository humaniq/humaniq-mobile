import { Model, model, ModelAutoTypeCheckingMode, setGlobalConfig, tProp as p, types as t } from "mobx-keystone"
import { WalletStore } from "./wallet/WalletStore"
import { ProviderStore } from "./provider/ProviderStore"
import { AppStore } from "./app/AppStore"
import { RequestStore } from "./api/RequestStore"
import { DictionaryStore } from "./dictionary/DictionaryStore"
import { ProfileStore } from "./profile/ProfileStore"
import { MoralisRequestStore } from "./api/MoralisRequestStore"
import { BrowserStore } from "./browser/BrowserStore";
import { WalletConnectStore } from "./walletConnect/WalletConnectStore";
import { BannerStore } from "./banner/BannerStore";

setGlobalConfig({
    modelAutoTypeChecking: ModelAutoTypeCheckingMode.AlwaysOff
})

@model("RootStore")
export class RootStore extends Model({
    initialized: p(t.boolean, false),
    requestStore: p(t.model<RequestStore>(RequestStore), () => new RequestStore({})),
    moralisRequestStore: p(t.model<MoralisRequestStore>(MoralisRequestStore), () => new MoralisRequestStore({})),
    dictionaryStore: p(t.model<DictionaryStore>(DictionaryStore), () => new DictionaryStore({})),
    appStore: p(t.model<AppStore>(AppStore), () => new AppStore({})),
    walletStore: p(t.model<WalletStore>(WalletStore), () => new WalletStore({})),
    profileStore: p(t.model<ProfileStore>(ProfileStore), () => new ProfileStore({})),
    providerStore: p(t.model<ProviderStore>(ProviderStore), () => new ProviderStore({})),
    browserStore: p(t.model<BrowserStore>(BrowserStore), () => new BrowserStore({})),
    walletConnectStore: p(t.model<WalletConnectStore>(WalletConnectStore), () => new WalletConnectStore({})),
    bannerStore: p(t.model<BannerStore>(BannerStore), () => new BannerStore({}))
}) {

}
