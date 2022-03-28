import { _await, model, Model, modelAction, modelFlow, tProp as p, types as t } from "mobx-keystone"
import { localStorage } from "../../utils/localStorage";
import { RequestStore } from "../api/RequestStore";
import { getRequest } from "../../App";
import { API_HUMANIQ_TOKEN, API_HUMANIQ_URL, HUMANIQ_ROUTES } from "../../config/api";

export enum SUGGESTION_STEP {
    SUGGESTION = 'SUGGESTION',
    ENTER_ID = 'ENTER_ID',
    VERIFICATION = 'VERIFICATION'
}

@model("ProfileStore")
export class ProfileStore extends Model({
    isSuggested: p(t.boolean, false),
    initialized: p(t.string, "").withSetter(),
    requested: p(t.boolean, false),
    formStep: p(t.enum(SUGGESTION_STEP), SUGGESTION_STEP.SUGGESTION).withSetter(),
    loaded: p(t.boolean, false),
    verified: p(t.boolean, false),
    checked: p(t.boolean, false),
    key: p(t.string, ""),
    user: p(t.maybeNull(t.object(() => ({
        uid: t.string,
        birthDate: t.string,
        country: t.string,
        city: t.string,
        firstName: t.string,
        lastName: t.string,
        createdAt: t.dateTimestamp
    }))))
}) {

    api: RequestStore

    @modelFlow
    * checkCode(value) {
        try {
            const result = yield* _await(this.api.post(HUMANIQ_ROUTES.INTROSPECT.POST_SIGNUP_CHECK, { confirmKey: value }))
            if (result.ok) {
                this.checked = true
                this.user = result.data
                this.key = value
                localStorage.save("hm-wallet-humaniqid-checked", true)
                localStorage.save("hm-wallet-humaniqid-user", this.user)
                this.requested = true
                return result.data
            } else {
                this.requested = true
                return false
            }
        } catch (e) {
            console.log("ERROR", e)
        }
    }

    @modelFlow
    * verify(key, address) {
        const result = yield* _await(this.api.post(HUMANIQ_ROUTES.INTROSPECT.POST_SIGNUP_CONFIRM, {
            confirmKey: key,
            walletId: address
        }))
        // @ts-ignore
        this.setVerified(result.ok)
    }
    

    @modelFlow
    * init() {
        this.isSuggested = (yield* _await(localStorage.load("hm-wallet-humaniqid-suggest"))) || false
        this.verified = (yield* _await(localStorage.load("hm-wallet-humaniqid-verified"))) || false
        this.checked = (yield* _await(localStorage.load("hm-wallet-humaniqid-checked"))) || false
        this.user = (yield* _await(localStorage.load("hm-wallet-humaniqid-user"))) || null
        this.initialized = true
        this.api = getRequest()
        this.api.init(API_HUMANIQ_URL, { "x-auth-token": API_HUMANIQ_TOKEN })
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
