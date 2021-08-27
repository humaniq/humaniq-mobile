import { makeAutoObservable } from "mobx"
import { getProfileStore } from "../../App"

export class ProfileScreenModel {
    initialized = false
    refreshing = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }


    async init() {
        try {
            this.initialized = true
        } catch (e) {
            console.log("INIT ERROR", e)
        }
    }

    async onRefresh() {
        this.refreshing = true
        await getProfileStore().load()
        this.refreshing = false
    }
}
