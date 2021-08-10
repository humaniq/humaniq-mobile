import { makeAutoObservable } from "mobx"
import { ETH_NETWORKS } from "../../config/network"
import * as storage from "../../utils/storage"
import { ethereumProvider } from "../../services/DataContext/ProviderStore";
import { runUnprotected } from "mobx-keystone";

export class SettingsScreenModel {
  
  initialized = false
  
  settingsDialog = {
    title: "RRR",
    display: false,
    options: [],
  }
  
  constructor() {
    makeAutoObservable(this)
    this.init()
  }
  
  get settingsMenu() {
    return [
      {
        id: 1,
        name: "Сеть эфира",
        currentValue: ethereumProvider.getDefault().currentNetworkName ,
        icon: "link",
        onPress: () => {
          this.settingsDialog.title = "Выбрать сеть"
          this.settingsDialog.display = true
          this.settingsDialog.options = Object.values(ETH_NETWORKS).map(i => ({
            label: i, onPress: () => {
              runUnprotected(() => {
                ethereumProvider.getDefault().currentNetworkName = i
              })
              storage.save("currentNetworkName", i)
            },
          }))
        },
      },
    ]
  }
  
  init() {
    this.initialized = true
  }
}
