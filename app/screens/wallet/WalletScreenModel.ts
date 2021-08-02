import { makeAutoObservable } from "mobx"

export class WalletScreenModel {
  counter = 0
  
  constructor() {
    makeAutoObservable(this)
  }
  
  get getCounter(): string {
    return this.counter.toString()
  }
  
  increment() {
    this.counter++
  }
}
