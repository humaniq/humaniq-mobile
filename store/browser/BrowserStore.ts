import {
  _await,
  fromSnapshot,
  getSnapshot,
  Model,
  model,
  modelAction,
  modelFlow,
  objectMap,
  tProp as p,
  types as t
} from "mobx-keystone";
import { computed } from "mobx";
import { captureRef } from 'react-native-view-shot';
import { Dimensions } from "react-native";
import Device from "../../utils/Device";
import { localStorage } from "../../utils/localStorage";

const margin = 16;
const THUMB_WIDTH = Dimensions.get('window').width / 2 - margin * 2;
const THUMB_HEIGHT = Device.isIos() ? THUMB_WIDTH * 1.81 : THUMB_WIDTH * 1.48;

@model("HistoryItem")
export class HistoryItem extends Model({
  url: p(t.string),
  tittle: p(t.string),
  icon: p(t.string)
}) {

}

@model("BrowserTab")
export class BrowserTab extends Model({
  url: p(t.string).withSetter(),
  id: p(t.string),
  image: p(t.string),
  icon: p(t.string).withSetter(),
  tittle: p(t.string).withSetter()
}) {
  @modelFlow
  * takeScreenShot(ref) {
    this.image = yield* _await(captureRef(ref, {
      format: 'jpg',
      quality: 0.2,
      width: THUMB_WIDTH,
      height: THUMB_HEIGHT,
    }))
  }
}

@model("BrowserStore")
export class BrowserStore extends Model({
  history: p(t.objectMap(t.model<HistoryItem>(HistoryItem)), () => objectMap()),
  whitelist: p(t.array(t.string), () => []),
  tabs: p(t.array(t.model<BrowserTab>(BrowserTab)), () => []),
  activeTab: p(t.string, () => null)
}) {

  @computed
  get historyKeys() {
    return Object.entries(this.history.items)
  }

  @modelFlow
  * init() {
    try {
      const stored = (yield* _await(localStorage.load("hm-wallet-browser-tabs"))) || {}
      if (stored.tabs) {
        this.tabs = fromSnapshot(stored.tabs)
        if (stored.activeTab && this.tabs.find(t => t.id === stored.activeTab)) {
          this.activeTab = stored.activeTab
        }
      }
      const storedHistory = (yield* _await(localStorage.load("hm-wallet-browser-history")))
      if (storedHistory) {
        this.history = fromSnapshot(storedHistory)
      }
    } catch (e) {
      console.log("ERROR", e)
      yield* _await(localStorage.save("hm-wallet-browser-tabs", {}))
      yield* _await(localStorage.save("hm-wallet-browser-history", false))
      this.init()
    }
  }

  @modelFlow
  * saveTabs() {
    yield* _await(localStorage.save("hm-wallet-browser-tabs", {
      tabs: getSnapshot(this.tabs),
      activeTab: getSnapshot(this.activeTab)
    }))
  }

  @computed
  get showTabs() {
    return !this.activeTab
  }

  @modelAction
  removeActiveTab = () => {
    this.activeTab = null
    this.saveTabs()
  }

  @modelAction
  setActiveTab = (id) => {
    this.activeTab = id
    this.saveTabs()
  }

  @modelFlow
  * saveBrowserHistory() {
    yield* _await(localStorage.save("hm-wallet-browser-history", getSnapshot(this.history)))
  }

  @modelAction
  addToBrowserHistory(item: HistoryItem) {
    this.history.set(new URL(item.url).host, item)
    this.saveBrowserHistory()
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
    this.saveTabs()
  }

  @modelAction
  createNewTab = (tab: BrowserTab) => {
    this.tabs.push(tab)
    this.saveTabs()
  }

  @modelAction
  closeTab = (id: string) => {
    this.tabs = this.tabs.filter(tab => tab.id !== id)
    if (this.activeTab === id) {
      this.removeActiveTab()
    }
    this.saveTabs()
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
    this.saveTabs()
  }
}