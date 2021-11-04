import { Model, model, tProp as p, types as t } from "mobx-keystone"
import { computed } from "mobx";

@model("ListStore")
export class ListStore extends Model({
  page: p(t.number, 1),
  pageSize: p(t.number, 20),
  total: p(t.number, 0),
}) {
  @computed
  get canLoad() {
    return this.total - (this.pageSize * this.page) / this.pageSize > 1
  }
}