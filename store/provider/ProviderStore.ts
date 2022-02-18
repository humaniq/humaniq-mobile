import { Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone"
import { EVMProvider } from "./EVMProvider"

@model("ProviderStore")
export class ProviderStore extends Model({
  initialized: p(t.string, ""),
  eth: p(t.model<EVMProvider>(EVMProvider), () => new EVMProvider({}))
}) {
  @modelFlow
  * init() {
    yield this.eth.init()
  }
}
