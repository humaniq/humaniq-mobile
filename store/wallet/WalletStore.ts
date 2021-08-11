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


export const walletStore = createContext<WalletStore>();

@model("WalletStore")
export class WalletStore extends Model({
  pending: p(t.boolean, false),
  initialized: p(t.string, ""),
  wallets: p(t.array(t.model<Wallet>(Wallet)), () => [])
}) {
  
  
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
      // privateKey = "0xa38a0419df94711ac7314004ececc9b643fa0f9f080a5c255fd2f2c4699d7d53";
      // address = "0x6b40c2686c83798EF433AE59448EB23cF9eDa436";
      // const testWalelt = new Wallet({
      //   address: "0x6b40c2686c83798EF433AE59448EB23cF9eDa436",
      //   privateKey: "0xa38a0419df94711ac7314004ececc9b643fa0f9f080a5c255fd2f2c4699d7d53",
      //   balance: "0",
      //   mnemonic: "fdf fdf df",
      //   locale: "ru",
      //   path: "fdf",
      //   publicKey: "sds"
      // });
      //
      // yield* testWalelt.init();
      // this.wallets.push(testWalelt);
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
