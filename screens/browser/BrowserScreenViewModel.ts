import { computed, makeAutoObservable } from "mobx";
import { getBrowserStore } from "../../App";
import { DAPPS_CONFIG } from "../../config/dapp";
import { BrowserTab } from "../../store/browser/BrowserStore";

export class BrowserScreenViewModel {
  constructor() {
    makeAutoObservable(this)
  }

  initialized = false

  @computed
  get tabs() {
    return getBrowserStore().tabs
  }

  @computed
  get activeTab() {
    return getBrowserStore().activeTab
  }

  init() {
    try {
      if (!getBrowserStore().tabs.length) {
        this.newTab()
      }
      const activeTab = getBrowserStore().activeTab
      if (activeTab) {
        getBrowserStore().setActiveTab(activeTab)
      } else {
        getBrowserStore().tabs.length > 0 && getBrowserStore().setActiveTab(getBrowserStore().tabs[0].id)
      }
    } catch (e) {
      console.log("ERROR", e)
    } finally {
      this.initialized = true
    }
  }

  newTab(url: string = DAPPS_CONFIG.HOMEPAGE_HOST) {
    const tab = new BrowserTab({ url, id: Date.now() })
    getBrowserStore().createNewTab(tab)
    getBrowserStore().setActiveTab(tab.id)
  }

  async showTabs(ref) {
    const activeTab = getBrowserStore().tabs.find(tab => tab.id === getBrowserStore().activeTab)
    await activeTab.takeScreenShot(ref)
    // @ts-ignore
    getBrowserStore().setShowTabs(true)
  }
}