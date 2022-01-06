import { _await, Model, model, modelAction, modelFlow, tProp as p, types as t } from "mobx-keystone";
import { computed } from "mobx";
import { captureScreen } from 'react-native-view-shot';
import { Dimensions } from "react-native";
import Device from "../../utils/Device";

const margin = 16;
const THUMB_WIDTH = Dimensions.get('window').width / 2 - margin * 2;
const THUMB_HEIGHT = Device.isIos() ? THUMB_WIDTH * 1.81 : THUMB_WIDTH * 1.48;

@model("HistoryItem")
export class HistoryItem extends Model({
  url: p(t.string),
  name: p(t.string)
}) {

}

@model("BrowserTab")
export class BrowserTab extends Model({
  url: p(t.string).withSetter(),
  id: p(t.string),
  image: p(t.string)
}) {
  @modelFlow
  * takeScreenShot() {
    this.image = yield* _await(captureScreen({
      format: 'jpg',
      quality: 0.2,
      width: THUMB_WIDTH,
      height: THUMB_HEIGHT,
    }))
  }
}

@model("BrowserStore")
export class BrowserStore extends Model({
  history: p(t.array(t.model<HistoryItem>(HistoryItem)), () => []),
  whitelist: p(t.array(t.string), () => []),
  tabs: p(t.array(t.model<BrowserTab>(BrowserTab)), () => []),
  activeTab: p(t.string, () => null)
}) {

  @computed
  get showTabs() {
    return !this.activeTab
  }

  @modelAction
  removeActiveTab = () => {
    this.activeTab = null
  }

  @modelAction
  setActiveTab = (id) => {
    this.activeTab = id
  }

  @modelAction
  addToBrowserHistory(item: HistoryItem) {
    this.history.push(item)
  }

  @modelAction
  addToBrowserWhiteList(url: string) {
    this.whitelist.push(url)
  }

  @modelAction
  clearBrowserHistory() {
    this.history = []
  }

  @modelAction
  closeAllTabs = () => {
    this.tabs = []
  }

  @modelAction
  createNewTab = (tab: BrowserTab) => {
    this.tabs.push(tab)
  }

  @modelAction
  closeTab = (id: string) => {
    this.tabs = this.tabs.filter(tab => tab.id !== id)
    if (this.activeTab === id) {
      this.removeActiveTab()
    }
  }

  @modelAction
  updateTab(item: BrowserTab) {
    this.tabs = this.tabs.map((tab) => {
      if (tab.id === item.id) {
        return item
      } else {
        return tab
      }
    })
  }
}