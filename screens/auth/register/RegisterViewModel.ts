import { makeAutoObservable } from "mobx";

export enum REGISTER_STATE {
  MAIN = "MAIN",
  REGISTER = "REGISTER",
  RECOVER = "RECOVER"
}

export class RegisterViewModel {
  initialized = false;
  state = REGISTER_STATE.MAIN;
  
  constructor() {
    makeAutoObservable(this);
  }
  
  async init() {
    this.initialized = true;
  }
}
