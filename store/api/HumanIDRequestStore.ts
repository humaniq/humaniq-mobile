import { _await, createContext, Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone";
import { ApisauceInstance, create } from "apisauce";
import { DEFAULT_API_CONFIG } from "../../config/api";

export const requestAuthStore = createContext<HumanIDRequestStore>();
export const getAuthRequest = () => requestAuthStore.getDefault();

@model("RequestStore")
export class HumanIDRequestStore extends Model({
  initialized: p(t.boolean, false)
}) {
  axios: ApisauceInstance;
  
  @modelFlow
  * init() {
    requestAuthStore.setDefault(this);
    this.axios = create({
      baseURL: DEFAULT_API_CONFIG.authUrl,
      timeout: DEFAULT_API_CONFIG.timeout
    });
    this.initialized = true;
  }
  
  @modelFlow
  // eslint-disable-next-line @typescript-eslint/ban-types
  * get(path, headers?: object) {
    return yield* _await(this.axios.get(path, headers));
  }
  
  @modelFlow
  // eslint-disable-next-line @typescript-eslint/ban-types
  * post(path, body?: object, headers?: object) {
    return yield* _await(this.axios.post(path, body, headers));
  }
}
