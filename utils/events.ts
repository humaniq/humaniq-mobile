import { RequestStore } from "../store/api/RequestStore";
import { API_EVENTS, EVENTS_ROUTES } from "../config/api";
import { localStorage } from "./localStorage";
import { getGroup, MARKETING_EVENTS } from "../config/events";
import Device from "./Device";
import { formatRoute } from "../navigators";
import { getAppStore } from "../App";


class Events {
    api: RequestStore

    constructor() {
        this.api = new RequestStore({})
        this.api.init(API_EVENTS)
    }


    init = async (loadSession = true) => {
        const headers = { "Content-Type": "application/json" }
        const uidClient = await localStorage.load('hm-event-client')
        if (uidClient) {
            Object.assign(headers, { 'x-event-client': uidClient })
            this.api.init(API_EVENTS, headers)
        } else {
            const result = await this.api.post(EVENTS_ROUTES.POST_CLIENT_DATA, await Device.getDeviceInfo()) as any
            if (result.ok) {
                Object.assign(headers, { 'x-event-client': result.data.payload.uid })
                this.api.init(API_EVENTS, headers)
                await localStorage.save('hm-event-client', result.data.payload.uid)
            }
        }

        if (loadSession) {
            const result = await this.api.post(EVENTS_ROUTES.POST_SESSION) as any
            if (result.ok) {
                Object.assign(headers, { 'x-event-session': result.data.payload.Uid })
            }
        }

        this.api.init(API_EVENTS, headers)
    }

    send = async (event: MARKETING_EVENTS) => {
        await this.api.post(formatRoute(EVENTS_ROUTES.POST_EVENT, { event: getGroup(event) }), {
            event: event,
            path: getAppStore().currentRoute
        })
    }
}

export const events = new Events()