import {
  _await,
  createContext,
  getSnapshot,
  Model,
  model,
  modelAction,
  modelFlow,
  tProp as p,
  types as t
} from "mobx-keystone";
import { reaction } from "mobx";
import * as storage from "../../utils/localStorage";
import uuid from "react-native-uuid";
import { ethereumProvider } from "../provider/EthereumProvider";
import { Wallet } from "./Wallet";
import "react-native-get-random-values";
import "@ethersproject/shims";
import HDKeyring from "eth-hd-keyring";
import { normalize } from "eth-sig-util";
import { ethers } from "ethers";

export const walletStore = createContext<WalletStore>();

@model("WalletStore")
export class WalletStore extends Model({
  pending: p(t.boolean, false),
  initialized: p(t.string, ""),
  wallets: p(t.array(t.model<Wallet>(Wallet)), () => [])
}) {
  
  keyring = new HDKeyring();
  storedWallets;
  
  
  @modelFlow
  * init(forse = false) {
    if (!this.initialized || forse) {
      if (this.storedWallets) {
        this.wallets = this.storedWallets.wallets.map(w => {
            // @ts-ignore
            const wallet = new Wallet({
              privateKey: normalize(Buffer.from(w.privateKey.data).toString("hex")),
              publicKey: normalize(Buffer.from(w.publicKey.data).toString("hex")),
              address: ethers.utils.computeAddress(normalize(Buffer.from(w.privateKey.data).toString("hex")))
            });
            wallet.init();
            return wallet;
          }) || [];
      }
      
      walletStore.setDefault(this);
      if (!this.initialized) {
        reaction(() => getSnapshot(ethereumProvider.getDefault().initialized), (value, a) => {
          this.init(true);
        });
      }
      this.initialized = uuid.v4();
    }
  }
  
  @modelAction
  * resetStore() {
    this.storedWallets = null;
    
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
  
  @modelFlow
  * createWallet() {
    console.log("SW", this.storedWallets?.mnemonic)
    this.keyring = this.storedWallets ? new HDKeyring(this.storedWallets.mnemonic) : new HDKeyring();
    yield* _await(this.keyring.addAccounts());
    const mnemonic = (yield* _await(this.keyring.serialize())) as {};
    console.log("MN", mnemonic);
    return {
      mnemonic,
      wallets: this.keyring.wallets
    };
  }
}
