import { _await, Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone";
import { ethers, Signer } from "ethers";
import { computed, observable } from "mobx";
import { amountFormat, currencyFormat } from "../../utils/number";
import { ethereumProvider } from "../provider/EthereumProvider";
import uuid from "react-native-uuid";
import { getRequest } from "../api/RequestStore";
import { ROUTES } from "../../config/api";
import { formatRoute } from "../../navigators";

@model("Wallet")
export class Wallet extends Model({
  isError: p(t.boolean, false),
  pending: p(t.boolean, false),
  initialized: p(t.string, ""),
  address: p(t.string, ""),
  name: p(t.string, ""),
  balance: p(t.string, "0"),
  mnemonic: p(t.string, ""),
  path: p(t.string, ""),
  hdPath: p(t.string, ""),
  privateKey: p(t.string),
  publicKey: p(t.string),
  balances: p(t.maybeNull(t.object(() => ({
    // Address: t.string,
    Amount: t.number,
    AmountUnconfirmed: t.number,
    RecomendedFee: t.number
    // Transactions: t.maybeNull(t.)
  })))),
  prices: p(t.maybeNull(t.object(() => ({
    eur: t.number,
    usd: t.number
  }))))
}) {
  
  @observable
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
    return +ethers.utils.formatEther(ethers.BigNumber.from(this.balances.Amount.toString()));
  }
  
  @computed
  get formatBalance() {
    return amountFormat(this.ethBalance, 8);
  }
  
  @computed
  get fiatBalance() {
    return currencyFormat(this.prices.usd * this.ethBalance);
  }
  
  @modelFlow
  * init() {
    try {
      this.pending = true;
      this.ether = new ethers.Wallet(this.privateKey, ethereumProvider.getDefault().currentProvider); // root.providerStore.eth.currenProvider || undefined);
      // yield this.updateBalanceFromProvider();
      yield this.updateBalanceFromApi();
      yield this.getCoinCost();
    } catch (e) {
      console.log("ERROR", e);
      this.isError = true;
    } finally {
      this.initialized = uuid.v4();
      this.pending = false;
    }
  }
  
  @modelFlow
  * updateBalanceFromProvider() {
    try {
      const bn = yield* _await(this.ether.getBalance());
      this.balance = this.isConnected ? bn.toString() : this.balance;
    } catch (e) {
      console.log("ERROR", e);
      this.isError = true;
    }
  }
  
  @modelFlow
  * updateBalanceFromApi() {
    const balances = yield getRequest().get(formatRoute(ROUTES.PRICES.GET_BALANCES_FOR_WALLET, {
      node: "eth",
      address: this.address
    }));
    if (balances.ok) {
      this.balances = balances.data.item;
    } else {
      this.isError = true;
    }
  }
  
  @modelFlow
  * getCoinCost() {
    const cost = yield getRequest().post(ROUTES.PRICES.GET_ALL_SUPPORT_COINS, {
      coins: [ "ethereum" ],
      withPrices: true
    });
    if (cost.ok) {
      this.prices = cost.data.items[0]["prices"];
    } else {
      this.isError = true;
    }
  }
}