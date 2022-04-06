import { Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone"
import { EVMProvider } from "./EVMProvider"
import { profiler } from "../../utils/profiler/profiler";
import { EVENTS } from "../../config/events";

@model("ProviderStore")
export class ProviderStore extends Model({
    initialized: p(t.string, ""),
    eth: p(t.model<EVMProvider>(EVMProvider), () => new EVMProvider({}))
}) {
    @modelFlow
    * init() {
        const id = profiler.start(EVENTS.INIT_PROVIDER_STORE)
        yield this.eth.init()
        profiler.end(id)
    }
}
