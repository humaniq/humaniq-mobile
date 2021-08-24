import { _await, createContext, Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone"
import { ApisauceInstance, create } from "apisauce"
import { DEFAULT_API_CONFIG } from "../../config/api"

export const authRequestStore = createContext<AuthRequestStore>()
export const getAuthRequest = () => authRequestStore.getDefault()

@model("AuthRequestStore")
export class AuthRequestStore extends Model({
    initialized: p(t.boolean, false)
}) {
    axios: ApisauceInstance
    
    @modelFlow
    * init() {
        authRequestStore.setDefault(this)
        this.axios = create({
            baseURL: DEFAULT_API_CONFIG.authUrl,
            timeout: DEFAULT_API_CONFIG.timeout
        })
        this.initialized = true
    }
    
    @modelFlow
    // eslint-disable-next-line @typescript-eslint/ban-types
    * get(path, headers?: object) {
        return yield* _await(this.axios.get(path, headers))
    }
    
    @modelFlow
    // eslint-disable-next-line @typescript-eslint/ban-types
    * post(path, body?: object, headers?: object) {
        return yield* _await(this.axios.post(path, body, headers))
    }

    @modelFlow
    // eslint-disable-next-line @typescript-eslint/ban-types
    * patch(path, body?: object, headers?: object) {
        return yield* _await(this.axios.patch(path, body, headers))

    }
}
