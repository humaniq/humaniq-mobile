import {Model, model, modelFlow, tProp as p} from "mobx-keystone";
import {types as t} from "mobx-keystone/dist/typeChecking/types";
import {getAuthRequest} from "../api/HumanIDRequestStore";
import {ROUTES} from "../../config/api";


@model("Auth")
export class Auth extends Model({
    isError: p(t.boolean, false),
    pending: p(t.boolean, false),
    initialized: p(t.string, ""),
    token: p(t.string, ""),
    registered: p(t.boolean, false)
}) {
 @modelFlow
 * login(wallet: string) {
    const auth = yield getAuthRequest().post(ROUTES.AUTH.LOGIN_POST, {
        wallet: wallet,
        platform_id: 0,
    })
     if (auth.ok) {
         this.token = auth.data.attributes.token
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
        this.token = reg.data.attributes.token
        this.registered = true
    }else {
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
     if (check.ok) {
        console.log("ERROR CHECK")
        
     }
 }

 @modelFlow
 * reset() {
     const refreshToken = yield getAuthRequest().post(ROUTES.AUTH.SESSION_REFRESH_POST, {}, {
         headers: {
             "Authorization": this.token,
         }
     })
     if (refreshToken.ok) {
         this.token = refreshToken.data.attributes.token
     }
 }
}