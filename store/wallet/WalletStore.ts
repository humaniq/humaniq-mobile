import {
  _await,
  createContext,
  fromSnapshot,
  getSnapshot,
  Model,
  model,
  modelFlow,
  tProp as p,
  types as t
} from "mobx-keystone";
import { reaction } from "mobx";
import * as storage from "../../utils/localStorage";
import uuid from "react-native-uuid";
import { ethereumProvider } from "../provider/EthereumProvider";
import { Wallet } from "./Wallet";
import Keyring from "eth-simple-keyring";

export const walletStore = createContext<WalletStore>();

@model("WalletStore")
export class WalletStore extends Model({
  pending: p(t.boolean, false),
  initialized: p(t.string, ""),
  wallets: p(t.array(t.model<Wallet>(Wallet)), () => [])
}) {
  
  keyring = new Keyring();
  
  
  @modelFlow
  * init(forse = false) {
    if (!this.initialized || forse) {
      const storedWallet = yield* _await(storage.load("wallets"));
      this.wallets = this.wallets.length > 0 ?
        this.wallets.map(w => {
          w.init();
          return w;
        }) :
        Object.values(storedWallet || {}).map(w => {
          // @ts-ignore
          const wallet = fromSnapshot<Wallet>(w);// new Wallet(w);
          wallet.init();
          return wallet;
        }) || [];
     
      walletStore.setDefault(this);
      if (!this.initialized) {
        reaction(() => getSnapshot(ethereumProvider.getDefault().initialized), (value, a) => {
          this.init(true);
        });
      }
      this.initialized = uuid.v4();
    }
  }
  
  @modelFlow
  * addWallet(wallet: Wallet) {
    yield wallet.init();
    this.wallets.push(wallet);
    yield this.saveWallets();
    return this.wallets;
  };
  
  @modelFlow
  * removeWallet(address: string) {
    this.wallets = this.wallets.filter(w => w.address !== address);
    yield this.saveWallets();
    return this.wallets;
  };
  
  @modelFlow
  * saveWallets() {
    const wallets = Object.values(this.wallets);
    const snapshots = wallets.map(v => getSnapshot(v));
    yield* _await(storage.save("wallets", snapshots));
  }
}
