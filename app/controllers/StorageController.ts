import { makeAutoObservable } from "mobx"

export class StorageController {
  counter = 0

  constructor() {
    makeAutoObservable(this)
  }
}
