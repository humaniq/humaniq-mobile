import { makeAutoObservable } from "mobx";
import { getBrowserStore } from "../../App";
import { DAPPS_CONFIG } from "../../config/dapp";
import { BrowserTab } from "../../store/browser/BrowserStore";

export class BrowserScreenViewModel {
  constructor() {
    makeAutoObservable(this)
  }


  init() {
    if (!getBrowserStore().tabs.length) {
      this.newTab()
    }
    const activeTab = getBrowserStore().activeTab
    if (activeTab) {
      this.switchToTab(activeTab)
    } else {
      getBrowserStore().tabs.length > 0 && this.switchToTab(getBrowserStore().tabs[0])
    }
  }

  newTab(url: string = DAPPS_CONFIG.HOMEPAGE_HOST) {
    getBrowserStore().createNewTab(new BrowserTab({ url, id: Date.now() }))
    this.switchToTab(getBrowserStore().tabs[getBrowserStore().tabs.length - 1])
  }

  switchToTab(tab: BrowserTab) {
    getBrowserStore().setActiveTab(tab)
  }

  async showTabs() {
    const activeTab = getBrowserStore().activeTab
    await activeTab.takeScreenShot()
    getBrowserStore().removeActiveTab()
  }



}