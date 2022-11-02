import { makeAutoObservable } from "mobx"

export class StorageService {
  counter = 0

  constructor() {
    makeAutoObservable(this)
  }
}
