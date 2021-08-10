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
import { ethers, Signer } from "ethers";
import { computed, reaction } from "mobx";
import { amountFormat } from "../../utils/number";
import * as storage from "../../utils/storage";
import { ethereumProvider } from "./ProviderStore";
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
