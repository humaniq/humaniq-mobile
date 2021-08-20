import { makeAutoObservable } from "mobx";

export class SelfAddressQrCodeDialogViewModel {
  pending = false;
  display = false;
  wallet
  
  constructor(props) {
    makeAutoObservable(this);
  }
}
