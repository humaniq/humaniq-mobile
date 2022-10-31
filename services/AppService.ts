import { makeAutoObservable } from "mobx";

export class AppService {

  counter = 0;

  constructor() {
    console.log("Construct service");
    makeAutoObservable(this, null, { autoBind: true });
  }

  increment = () => {
    console.log("increment");
    this.counter++;
  };

  init = () => {
    console.log("init");
  };
}
