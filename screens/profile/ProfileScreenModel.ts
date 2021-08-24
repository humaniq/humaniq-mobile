import {makeAutoObservable} from "mobx";
import {getProfileStore} from "../../store/profile/ProfileStore";
import {getAuthStore} from "../../store/auth/AuthStore";
import {RootStore} from "../../store/RootStore";

export class ProfileScreenModel {
    initialized = false;
    rootStore: RootStore;
    refreshing = false;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    async init(rootStore) {
        this.rootStore = rootStore;
        try {
            this.initialized = true;
        } catch (e) {
            console.log("INIT ERROR", e);
        }
    }

    async onRefresh() {
        this.refreshing = true;
        await getProfileStore().load(getAuthStore().token);
        this.refreshing = false
    }
}
