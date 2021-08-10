import "@ethersproject/shims";
import { makeAutoObservable } from "mobx";

export class AppViewModel {
  initialized = false;
  
  constructor() {
    makeAutoObservable(this);
  }
  
  init() {
   this.initialized = true
  }
}
