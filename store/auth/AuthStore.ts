import { Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone"
import { ROUTES } from "../../config/api"
import uuid from "react-native-uuid"
import { getAuthRequest } from "../../App"


@model("AuthStore")
export class AuthStore extends Model({
    isError: p(t.boolean, false),
    pending: p(t.boolean, false),
    initialized: p(t.string, ""),
    token: p(t.string, ""),
    refresh_token: p(t.string, ""),
    loggedIn: p(t.boolean, false)
}) {

    @modelFlow
    * init() {
        this.initialized = uuid.v4()
    }

    @modelFlow
    * login(wallet: string) {
        const auth = yield getAuthRequest().post(ROUTES.AUTH.LOGIN_POST, {
            wallet: wallet,
            platform_id: 1,
        })
        if (auth.ok) {
            this.token = auth.data.data.attributes.access_token
            this.refresh_token = auth.data.data.attributes.refresh_token
            this.loggedIn = true
        } else {
            console.log("ERROR LOGIN")
            this.isError = true
        }
        return auth
    }

    @modelFlow
    * registration(wallet: string) {
        const reg = yield getAuthRequest().post(ROUTES.AUTH.REGISTRATION_POST, {
            wallet: wallet,
            language: 1,
            platform_id: 1
        })
        if (reg.ok) {
            this.token = reg.data.data.attributes.access_token
            this.refresh_token = reg.data.data.attributes.refresh_token
            this.loggedIn = true
        } else {
            console.log("REGISTRATION_ERROR")
        }
        return reg
    }

    @modelFlow
    * registrationOrLogin(wallet: string) {
        console.log('registration-or-login', this.loggedIn)
        if (this.loggedIn) return
        const reg = yield this.registration(wallet)
        if (!reg.ok) {
            const login = yield this.login(wallet)
            if (!login.ok) {
                this.isError = true
            }
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
