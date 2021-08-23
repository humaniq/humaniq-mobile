import { autorun, makeAutoObservable } from "mobx";
import { getRequest, requestStore } from "../../../store/api/RequestStore";
import { ROUTES } from "../../../config/api";
import { formatRoute } from "../../../navigators";
import { Wallet } from "../../../store/wallet/Wallet";
import { BigNumber, ethers } from "ethers";
import { t } from "../../../i18n";

export class SendTransactionViewModel {
  display = false;
  pending = false;
  wallet: Wallet;
  txData = {
    chainId: 0,
    gasLimit: 0,
    gasPrice: 0,
    nonce: "",
    value: "",
    to: ""
  };
  txError = false;
  message = ""
  
  get Tx() {
    return {
      ...this.txData,
      value: ethers.utils.parseEther(this.txData.value)
    };
  }
  
  get isTransferAllow() {
    if (!this.wallet.balances.amount || !this.txData.value) return false;
    return BigNumber.from(this.wallet.balances.amount)
      .gt(ethers.utils.parseEther(this.txData.value).add(
          BigNumber.from(this.txData.gasLimit * this.txData.gasPrice)
        )
      );
  }
  
  sendTx = async () => {
    try {
      const tx = await this.wallet.ether.signTransaction(this.Tx);
      try {
        const result = await getRequest().post(formatRoute(ROUTES.TX.SEND_TRANSACTION, { type: "eth" }), { raw_tx: tx });
        this.message = result.ok ? t("sendTransactionDialog.successTx") : t("sendTransactionDialog.errorTx")
      } catch (e) {
        console.log("ERROR", e);
      }
    } catch (e) {
      this.txError = true;
      console.log("ERROR", e);
    }
  };
  
  getTransactionData = autorun(async () => {
    if (this.display) {
      const txData = await getRequest().post(formatRoute(ROUTES.TX.GET_TRANSACTION_DATA, { type: "eth" }), { from: this.wallet.address });  // requ.get(ROUTES.TX.GET_TRANSACTION_DATA);
      if (txData.ok) {
        // @ts-ignore
        this.txData = { ...this.txData, ...txData.data.item };
      } else {
        console.log("ERROR", txData);
      }
    }
  });
  
  
  constructor() {
    makeAutoObservable(this);
  }
}
