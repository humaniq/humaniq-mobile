import { Model, model, objectMap, tProp as p, types as t } from "mobx-keystone";
import { computed } from "mobx";
import { ERC20Transaction } from "./ERC20Transaction";

@model("ERC20TransactionStore")
export class ERC20TransactionStore extends Model({
  page: p(t.number, 0),
  pageSize: p(t.number, 20),
  total: p(t.number, 0),
  map: p(t.objectMap(t.model<ERC20Transaction>(ERC20Transaction)), () => objectMap<ERC20Transaction>()),
  loading: p(t.boolean, false)
}) {
  @computed
  get list() {
    return Object.values<ERC20Transaction>(this.map.items).sort((a, b) => b.blockTimestamp - a.blockTimestamp)
  }

  @computed
  get canLoad() {
    return (this.total - (this.pageSize * this.page)) / this.pageSize > 0
  }

  incrementOffset() {
    if (this.canLoad) this.page += 1
  }
}