import { makeAutoObservable } from "mobx";

export class SelfAddressQrCodeDialogViewModel {
  pending = false;
  display = false;
  
  constructor(props) {
    makeAutoObservable(this);
  }
}
