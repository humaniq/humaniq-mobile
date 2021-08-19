import { createContext, Model, model, modelAction, tProp as p, types as t } from "mobx-keystone";

export const apiStore = createContext<ApiStore>()
export const getApi = () => apiStore.getDefault()

@model("ApiStore")
export class ApiStore extends Model({
  initialized: p(t.boolean, false),
}) {
  @modelAction
  init() {
    this.initialized = true
  }
}
