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
            this.lastname = profile.attributes.lastname
            this.firstname = profile.attributes.firstname
            this.email = profile.attributes.email
            this.photoUrl = profile.attributes.photoUrl
            this.loaded = true
        }
    }

    @modelFlow
    // eslint-disable-next-line @typescript-eslint/ban-types
    * update(profile: object, token: string) {
        const res = yield getAuthRequest().patch(ROUTES.PROFILE.UPDATE_PATH, profile, { headers : {
                Authorization: token
        }})
        if (res.ok) {
            this.load(token)
        }
    }
}
