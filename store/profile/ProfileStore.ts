import { _await, model, Model, modelAction, modelFlow, tProp as p, types as t } from "mobx-keystone"
import { localStorage } from "../../utils/localStorage";

export enum SUGGESTION_STEP {
    SUGGESTION = 'SUGGESTION',
    ENTER_ID = 'ENTER_ID',
    VERIFICATION = 'VERIFICATION'
}

@model("ProfileStore")
export class ProfileStore extends Model({
    isSuggested: p(t.boolean, false),
    initialized: p(t.string, "").withSetter(),
    formStep: p(t.enum(SUGGESTION_STEP), SUGGESTION_STEP.SUGGESTION).withSetter(),
    loaded: p(t.boolean, false),
    verified: p(t.boolean, false),
}) {

    @modelFlow
    * init() {
        this.isSuggested = (yield* _await(localStorage.load("hm-wallet-humaniqid-suggest"))) || false
        this.verified = (yield* _await(localStorage.load("hm-wallet-humaniqid-verified"))) || false
        this.initialized = true
    }

    @modelAction
    async setIsSuggested(val: boolean) {
        this.isSuggested = val
        await localStorage.save("hm-wallet-humaniqid-suggest", val)
    }

    @modelAction
    async setVerified(val: boolean) {
        this.verified = val
        this.formStep = SUGGESTION_STEP.SUGGESTION
        await localStorage.save("hm-wallet-humaniqid-verified", val)
    }
}
