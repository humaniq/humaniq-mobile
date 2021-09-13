import { makeAutoObservable, toJS } from "mobx"

export class ExploreModalViewModel {

    tabs = []
    selectedTab = null

    get tabsArr() {
        return toJS(this.tabs)
    }

    display = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }
}
