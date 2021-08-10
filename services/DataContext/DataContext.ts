import { RootStore } from "./RootStore";
import { registerRootStore } from "mobx-keystone";

export class DataContext {
  public static models: RootStore
  
  static create() {
    DataContext.models = new RootStore({})
    registerRootStore(DataContext.models)
    return DataContext.models
  }
}
