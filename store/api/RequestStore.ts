import { _async, _await, createContext, Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone";
import { ApisauceInstance, create } from "apisauce";
import { DEFAULT_API_CONFIG } from "../../config/api";

export const requestStore = createContext<RequestStore>();
export const getRequest = () => requestStore.getDefault();

@model("RequestStore")
export class RequestStore extends Model({
  initialized: p(t.boolean, false)
}) {
  axios: ApisauceInstance;
  
  @modelFlow
  * init() {
    requestStore.setDefault(this);
    this.axios = create({
      baseURL: DEFAULT_API_CONFIG.url,
      timeout: DEFAULT_API_CONFIG.timeout
    });
    this.initialized = true;
  }
  
  @modelFlow
  get = _async(function* (this: RequestStore, path) {
    return yield* _await(this.axios.get(path));
  });
  
  @modelFlow
  post = _async(function* (this: RequestStore, path, body?: object) {
    return yield* _await(this.axios.post(path, body));
  });
}
