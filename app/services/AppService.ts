import { makeAutoObservable } from "mobx"
import { StorageService } from "./StorageService"
import { inject } from "react-ioc"

export class AppService {

  storage = inject(this, StorageService)

  constructor() {
    makeAutoObservable(this, null, { autoBind: true })
  }

  increment = () => {
    console.log("increment")
    this.storage.counter++
  }

  get counter() {
    return this.storage.counter
  }

  init = () => {
    console.log("init")
  }
}
