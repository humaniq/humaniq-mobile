import { makeAutoObservable } from "mobx";
import { NavigationProp } from "@react-navigation/native";
import { RootStore } from "../../../store/RootStore";

export class LoginViewModel {
  
  initialized = false;
  pending = false;
  navigation: NavigationProp<any>;
  store: RootStore;
  
  initNavigation(nav) {
    this.navigation = nav;
  }
  
  async init(store?: RootStore) {
    if (store) {
      this.store = store;
    }
  }
  
  goLogin() {
    // this.store = store;
  }
  
  goRegister() {
    // this.store = store;
  }
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
