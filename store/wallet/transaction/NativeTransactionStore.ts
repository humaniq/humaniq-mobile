import { Model, model, modelAction, objectMap, tProp as p, types as t } from "mobx-keystone";
import { NativeTransaction } from "./NativeTransaction";
import { computed } from "mobx";

@model("NativeTransactionStore")
export class NativeTransactionStore extends Model({
    page: p(t.number, 0),
    cursor: p(t.maybeNull(t.string), null),
    pageSize: p(t.number, 20),
    total: p(t.number, 0),
    map: p(t.objectMap(t.model<NativeTransaction>(NativeTransaction)), () => objectMap<NativeTransaction>()),
    loading: p(t.boolean, false),
    initialized: p(t.boolean, false)
}) {
    @computed
    get list() {
        return Object.values<NativeTransaction>(this.map.items).sort((a, b) => b.blockTimestamp - a.blockTimestamp)
    }

    @modelAction
    set(key, tx) {
        this.map.set(key, tx)
    }

    @computed
    get canLoad() {
        return (this.total - (this.pageSize * this.page)) / this.pageSize > 0
    }

    @modelAction
    incrementOffset() {
        if (this.canLoad) this.page += 1
    }
}