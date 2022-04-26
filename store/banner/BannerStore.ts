import { _await, Model, model, modelAction, modelFlow, runUnprotected, tProp as p, types as t } from "mobx-keystone";
import { localStorage } from "../../utils/localStorage";
import { t as trans } from "../../i18n"
import { computed } from "mobx";
import { getAppStore } from "../../App";
import { LOCKER_MODE } from "../app/AppStore";
import { RootNavigation } from "../../navigators";

export enum BANNERS_NAMES {
    HUMANIQ_ID = 'HUMQNIQ_ID',
    CHECK_SEED = 'CHECK_SEED'
}

@model("Banner")
export class Banner extends Model({
    id: p(t.string, ""),
    tittle: p(t.string, ""),
    description: p(t.string, ""),
    isSuggested: p(t.boolean, true),
    colors: p(t.array(t.string), () => []),
    locations: p(t.array(t.number), () => [ 0, 0.5 ]),
    initialized: p(t.boolean, false)
}) {
    onPress
    image

    @modelAction
    setSuggest = (val: boolean) => {
        this.isSuggested = val
        localStorage.save(`hm-wallet-humaniqid-offer-${ this.id }`, this.isSuggested)
    }

    @modelFlow
    * init() {
        this.isSuggested = (yield* _await(localStorage.load(`hm-wallet-humaniqid-offer-${ this.id }`))) || false
        this.initialized = true
    }
}

@model("BannerStore")
export class BannerStore extends Model({
    initialized: p(t.boolean, false),
    allBanners: p(t.array(t.model<Banner>(Banner)), () => [])
}) {

    @modelFlow
    * init() {
        const humqniqId = new Banner({
            id: BANNERS_NAMES.HUMANIQ_ID,
            tittle: trans("offers.humaniqId.tittle"),
            description: trans("offers.humaniqId.description"),
            isSuggested: false,
            colors: [ "#2D71D8", "#73B5FF" ],
            locations: [ 0, 0.5 ]
        })

        humqniqId.image = require("../../assets/images/girl.svg")
        humqniqId.onPress = () => {
            RootNavigation.navigate("humaniqID")
        }

        const checkSeed = new Banner({
            id: BANNERS_NAMES.CHECK_SEED,
            tittle: trans("offers.seed.tittle"),
            description: trans("offers.seed.description"),
            isSuggested: false,
            colors: [ "#D9AAFE", "#1F8AFF" ],
            locations: [ 0, 0.4 ]
        })

        checkSeed.image = require("../../assets/images/shield.svg")
        checkSeed.onPress = () => {
            runUnprotected(() => {
                getAppStore().lockerPreviousScreen = "recovery"
                getAppStore().lockerMode = LOCKER_MODE.CHECK
                getAppStore().isLocked = true
            })
        }

        yield humqniqId.init()
        yield checkSeed.init()

        this.allBanners = [ humqniqId, checkSeed ]
        this.initialized = true
    }

    @modelAction
    setSuggest = (name: BANNERS_NAMES, val: boolean) => {
        const banner = this.allBanners.find(b => b.id === name)
        if (banner) {
            banner.setSuggest(val)
        }
    }

    @computed
    get banners() {
        return this.allBanners.filter(o => !o.isSuggested)
    }
}