import {
    createContext,
    getSnapshot,
    model,
    Model, modelAction,
    modelFlow,
    runUnprotected,
    tProp as p,
    types as t
} from "mobx-keystone"
import { computed, reaction } from "mobx"
import { getAuthRequest } from "../api/AuthRequestStore"
import { ROUTES } from "../../config/api"
import { getAuthStore } from "../auth/AuthStore"
import uuid from "react-native-uuid"

export const profileStore = createContext<ProfileStore>()
export const getProfileStore = () => profileStore.getDefault()

@model("ProfileStore")
export class ProfileStore extends Model({
    lastName: p(t.string, ""),
    firstName: p(t.string, ""),
    email: p(t.string, ""),
    photoUrl: p(t.string, ""),
    initialized: p(t.string, "").withSetter(),
    loaded: p(t.boolean, false)
}) {


    @modelFlow
    * init() {
        profileStore.setDefault(this)
        if (!this.initialized) {
            reaction(() => getSnapshot(getAuthStore().loggedIn), async (val) => {
                if (val) {
                    await this.load()
                    console.log("LOGGED_IN")
                    runUnprotected(() => {
                        this.initialized = uuid.v4()
                    })
                }
            })
        }
    }


    @computed
    get fullName() {
        return this.firstName + " " + this.lastName
    }

    @modelFlow
    * load() {
        const profile = yield getAuthRequest().get(ROUTES.PROFILE.GET)
        if (profile.ok) {
            this.lastName = profile.data.data.attributes.last_name
            this.firstName = profile.data.data.attributes.first_name
            this.email = profile.data.data.attributes.email
            this.photoUrl = profile.data.data.attributes.photoUrl
            this.loaded = true
        }
    }

    @modelFlow
    // eslint-disable-next-line @typescript-eslint/ban-types
    * update(profile: object) {
        const res = yield getAuthRequest().patch(ROUTES.PROFILE.UPDATE_PATH, profile)
        console.log(res)
        if (res.ok) {
            this.load()
        }
    }
}
