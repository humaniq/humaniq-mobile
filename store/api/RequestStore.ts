import { _async, _await, Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone"
import { ApisauceInstance, create } from "apisauce"
import { DEFAULT_API_CONFIG } from "../../config/api"


@model("RequestStore")
export class RequestStore extends Model({
    initialized: p(t.boolean, false)
}) {
    axios: ApisauceInstance;

    @modelFlow
    * init(url: string = DEFAULT_API_CONFIG.url, headers = {}) {
        this.axios = create({
            baseURL: url,
            timeout: DEFAULT_API_CONFIG.timeout,
            headers
        });
        this.initialized = true;
    }

    @modelFlow
    get = _async(function* (this: RequestStore, path, params?: any) {
        return yield* _await(this.axios.get<any>(path, params))
    })

    @modelFlow
        // eslint-disable-next-line @typescript-eslint/ban-types
    post = _async(function* (this: RequestStore, path, body?: object) {
        return yield* _await(this.axios.post(path, body));
    });
}
