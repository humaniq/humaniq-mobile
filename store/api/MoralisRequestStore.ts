import { _async, _await, Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone"
import { ApisauceInstance, create } from "apisauce"
import { DEFAULT_API_CONFIG, MORALIS_TOKEN } from "../../config/api"


@model("MoralisRequestStore")
export class MoralisRequestStore extends Model({
    initialized: p(t.boolean, false)
}) {
    axios: ApisauceInstance

    @modelFlow
    * init() {
        this.axios = create({
            baseURL: DEFAULT_API_CONFIG.moralisUrl,
            timeout: DEFAULT_API_CONFIG.timeout,
            headers: {
                "X-API-Key": MORALIS_TOKEN
            }
        })
        this.initialized = true
    }

    @modelFlow
    get = _async(function* (this: MoralisRequestStore, path, params?: any) {
        return yield* _await(this.axios.get<any>(path, params))
    })

    @modelFlow
        post = _async(function* (this: MoralisRequestStore, path, body?: any) {
        return yield* _await(this.axios.post(path, body))
    })
}
