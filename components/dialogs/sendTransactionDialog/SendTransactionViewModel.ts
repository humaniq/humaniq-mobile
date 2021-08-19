import { makeAutoObservable } from "mobx";

export class SendTransactionViewModel {
  display = false;
  pending = false;
  
  amount
  
  
  constructor() {
    makeAutoObservable(this);
  }
}
