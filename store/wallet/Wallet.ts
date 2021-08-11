import { _await, Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone";
import { ethers, Signer } from "ethers";
import { computed } from "mobx";
import { amountFormat } from "../../utils/number";
import { ethereumProvider } from "../provider/EthereumProvider";
import uuid from "react-native-uuid";

@model("Wallet")
export class Wallet extends Model({
  pending: p(t.boolean, false),
  initialized: p(t.string, ""),
  
  address: p(t.string),
  name: p(t.string),
  balance: p(t.string),
  mnemonic: p(t.string),
  path: p(t.string),
  locale: p(t.string),
  privateKey: p(t.string),
  publicKey: p(t.string)
}) {
  
  ether: Signer;
  
  @computed
  get isConnected() {
    return !!this.ether.provider;
  }
  
  @computed
  get formatAddress() {
    return this.address ? `${ this.address.slice(0, 4) }...${ this.address.substring(this.address.length - 4) }` : "";
  }
  
  @computed
  get ethBalance() {
    return +ethers.utils.formatEther(ethers.BigNumber.from(this.balance.toString()));
  }
  
  @computed
  get formatBalance() {
    return amountFormat(this.ethBalance, 8);
  }
  
  @modelFlow
  * init() {
    this.pending = true;
    this.ether = new ethers.Wallet(this.privateKey, ethereumProvider.getDefault().currentProvider); // root.providerStore.eth.currenProvider || undefined);
    yield this.updateBalance();
    this.initialized = uuid.v4();
    this.pending = false;
  }
  
  @modelFlow
  * updateBalance() {
    try {
      const bn = yield* _await(this.ether.getBalance());
      this.balance = this.isConnected ? bn.toString() : this.balance;
    } catch (e) {
      console.log("ERROR", e);
    }
  }
}
