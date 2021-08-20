import { autorun, makeAutoObservable } from "mobx";
import { requestStore } from "../../../store/api/RequestStore";
import { ROUTES } from "../../../config/api";
import { formatRoute } from "../../../navigators";

export class SendTransactionViewModel {
  display = false;
  pending = false;
  
  amount;
  
  getTransactionData = autorun(async () => {
    if (this.display) {
      const txData = await requestStore.getDefault().get(formatRoute(ROUTES.TX.GET_TRANSACTION_DATA, { type: "eth" }));  // requ.get(ROUTES.TX.GET_TRANSACTION_DATA);
      if (txData.ok) {
        console.log(txData);
      } else {
        console.log("ERROR", txData);
      }
      console.log(this.display);
    }
  });
  
  
  constructor() {
    makeAutoObservable(this);
  }
}
