import { makeAutoObservable } from "mobx";

export class TabsScreenViewModel {
  constructor() {
    makeAutoObservable(this)
  }
}