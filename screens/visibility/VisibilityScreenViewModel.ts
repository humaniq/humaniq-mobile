import { makeAutoObservable } from "mobx";

export class VisibilityScreenViewModel {

    initialized = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    init = async () => {
        this.initialized = true
    }
}