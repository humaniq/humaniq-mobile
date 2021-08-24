import { createContext, Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone"
import { getAuthRequest } from "../api/AuthRequestStore"
import { ROUTES } from "../../config/api"
import uuid from "react-native-uuid";

export const authStore = createContext<AuthStore>()
export const getAuthStore = () => authStore.getDefault()

@model("AuthStore")
export class AuthStore extends Model({
    isError: p(t.boolean, false),
    pending: p(t.boolean, false),
    initialized: p(t.string, ""),
    token: p(t.string, ""),
    refresh_token: p(t.string, ""),
    registered: p(t.boolean, false)
}) {
    
    @modelFlow
    * init() {
        authStore.setDefault(this)
        this.initialized = uuid.v4();
    }
    
    @modelFlow
    * login(wallet: string) {
        const auth = yield getAuthRequest().post(ROUTES.AUTH.LOGIN_POST, {
            wallet: wallet,
            platform_id: 0,
        })
        if (auth.ok) {
            this.token = auth.data.attributes.access_token
            this.refresh_token = auth.data.attributes.refresh_token
        } else {
            console.log("ERROR LOGIN")
            this.isError = true
        }
    }
    
    @modelFlow
    * registration(wallet: string) {
        const reg = yield getAuthRequest().post(ROUTES.AUTH.REGISTRATION_POST, {
            wallet: wallet,
            language: 1,
            platform_id: 1
        })
        if (reg.ok) {
            this.token = reg.data.attributes.access_token
            this.refresh_token = reg.data.attributes.refresh_token
            this.registered = true
        } else {
            console.log(reg)
            this.isError = true
        }
    }
    
    @modelFlow
    * registrationOrLogin(wallet: string) {
        if (this.registered) {
            this.login(wallet)
        } else {
            this.registration(wallet)
        }
    }
    
    @modelFlow
    * check() {
        const check = yield getAuthRequest().get(ROUTES.AUTH.SESSION_CHECK_GET, {
            headers: {
                "Authorization": this.token,
            }
        })
        return check.ok
    }
    
    @modelFlow
    * reset() {
        const refreshToken = yield getAuthRequest().post(ROUTES.AUTH.SESSION_REFRESH_POST, {}, {
            headers: {
                "Authorization": this.token,
            }
        })
        if (refreshToken.ok) {
            this.token = refreshToken.data.attributes.access_token
            this.refresh_token = refreshToken.data.attributes.refresh_token
        }
    }
}
