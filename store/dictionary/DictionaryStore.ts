import { _await, Model, model, modelFlow, objectMap, tProp as p, types as t } from "mobx-keystone"
import uuid from "react-native-uuid"
import { create } from "apisauce";
import { TOKEN_LOGO_URL } from "../../config/api";
import { localStorage } from "../../utils/localStorage";
import { MONTH } from "../../config/common";


@model("Coin")
export class Coin extends Model({
  name: p(t.string),
  symbol: p(t.string),
  prices: p(t.maybeNull(t.object(() => ({
    eur: t.number,
    usd: t.number
  }))))
}) {
}


@model("DictionaryStore")
export class DictionaryStore extends Model({
  initialized: p(t.string, ""),
  coinsDictionary: p(t.array(t.model<Coin>(Coin)), () => []),
  ethToken: p(t.objectMap(t.object(() => ({
    logoURI: t.string,
    address: t.string,
    decimals: t.number,
    type: t.string
  }))), () => objectMap()),
  ethTokenCurrentAddress: p(t.objectMap(t.string), () => objectMap())
}) {

  @modelFlow
  * init() {
    // (yield* _await(localStorage.remove("hm-wallet-tokens-update")))
    const last = (yield* _await(localStorage.load("hm-wallet-tokens-update")))
    const lastTokenUpdate = +last || Date.now() - (MONTH + 1)
    let tokens = []
    if (Date.now() - MONTH > lastTokenUpdate) {
      const axios = create({ baseURL: TOKEN_LOGO_URL })
      const res = yield* _await(axios.get<any>(""))
      if (res.ok) {
        tokens = res.data.tokens.length ? res.data.tokens : []
        console.log("update-tokens-url")
        yield* _await(localStorage.save("hm-wallet-tokens-update", Date.now()))
        yield* _await(localStorage.save("hm-wallet-tokens", tokens))
      }
    } else {
      tokens = (yield* _await(localStorage.load("hm-wallet-tokens")))
    }
    tokens.forEach(t => this.ethToken.set(t.symbol, {
      logoURI: t.logoURI,
      address: t.address,
      decimals: t.decimals,
      type: t.type
    }))
    this.initialized = uuid.v4()
  }
}
