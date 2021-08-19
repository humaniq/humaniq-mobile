import { createContext, Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone";
import uuid from "react-native-uuid";

export const dictionaryStore = createContext<DictionaryStore>();
export const getDictionary = () => dictionaryStore.getDefault();

@model("Coin")
export class Coin extends Model({
  name: p(t.string),
  symbol: p(t.string),
  prices: p(t.maybeNull(t.object(() =>({
    eur: t.number,
    usd: t.number
  }))))
}) {
}

@model("DictionaryStore")
export class DictionaryStore extends Model({
  initialized: p(t.string, ""),
  coinsDictionary: p(t.array(t.model<Coin>(Coin)), () => [])
}) {
  
  @modelFlow
  * init() {
    dictionaryStore.setDefault(this);
    // const result = yield getRequest().get(ROUTES.PRICES.GET_ALL_SUPPORT_COINS);
    // if (result.ok) {
    //   this.coinsDictionary = fromSnapshot(result.data.items);
    //   console.log(this.coinsDictionary[0]);
    // }
    this.initialized = uuid.v4();
  }
}
