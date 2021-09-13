import { Model, model, modelFlow, tProp as p, types as t } from "mobx-keystone"
import uuid from "react-native-uuid"


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
    coinsDictionary: p(t.array(t.model<Coin>(Coin)), () => [])
}) {

    @modelFlow
    * init() {
        this.initialized = uuid.v4()
    }
}
