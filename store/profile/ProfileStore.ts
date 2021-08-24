import {createContext, Model, modelFlow, tProp as p, types as t} from "mobx-keystone";
import {computed} from "mobx";
import {getAuthRequest} from "../api/AuthRequestStore";
import {ROUTES} from "../../config/api";

export const profileStore = createContext<ProfileStore>()
export const getProfileStore = () => profileStore.getDefault()

export class ProfileStore extends Model({
    lastname: p(t.string, ""),
    firstname: p(t.string, ""),
    email: p(t.string, ""),
    photoUrl: p(t.string, ""),
    initialized: p(t.string, ""),
    loaded: p(t.boolean, false)
}) {

    @modelFlow
    * init() {
        profileStore.setDefault(this)
        this.initialized = true
    }


    @computed
    get fullName() {
        return this.firstname + " " + this.lastname;
    }

    @modelFlow
    * load(token: string) {
        const profile = yield getAuthRequest().get(ROUTES.PROFILE.GET, { headers : {
                Authorization: token
            }})

        if(profile.ok) {
            this.lastname = profile.data.lastname
            this.firstname = profile.data.firstname
            this.email = profile.data.email
            this.photoUrl = profile.data.photoUrl
            this.loaded = true
        }
    }
}
