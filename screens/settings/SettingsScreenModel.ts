import { makeAutoObservable } from "mobx"
import { ETH_NETWORKS } from "../../config/network"
import * as storage from "../../utils/localStorage"
import { localStorage } from "../../utils/localStorage"
import { runUnprotected } from "mobx-keystone"
import { ethereumProvider } from "../../store/provider/EthereumProvider"
import { getAppStore } from "../../store/app/AppStore"
import { getProfileStore } from "../../store/profile/ProfileStore"

export class SettingsScreenModel {

  initialized = false;

  settingsDialog = {
    title: "RRR",
    display: false,
    options: []
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.init();
  }

  get isAllInitialized() {
      return this.initialized && !!getProfileStore().initialized
  }

  get settingsMenu() {
    const settings = [ {
      id: 1,
      type: "dialog",
      name: "Сеть эфира",
      currentValue: ethereumProvider.getDefault().currentNetworkName,
      icon: "link",
      onPress: (val?: any) => {
        this.settingsDialog.title = "Выбрать сеть";
        this.settingsDialog.display = true;
        this.settingsDialog.options = Object.values(ETH_NETWORKS).map(i => ({
          label: i, onPress: () => {
            runUnprotected(() => {
              ethereumProvider.getDefault().currentNetworkName = i;
            });
            storage.save("currentNetworkName", i);
          }
        }));
      }
    } ];

    if (__DEV__ && getAppStore().savedPin) {
      settings.push({
        id: 2,
        type: "toggle",
        name: "Отключить пинкод",
        currentValue: !!getAppStore().storedPin,
        icon: "link",
        onPress: (val?: boolean) => {
          console.log(getAppStore().storedPin);
          runUnprotected(() => {
            console.log({val, pin: getAppStore().savedPin})
            getAppStore().storedPin = val ? getAppStore().savedPin : false;
          })
          localStorage.save("hm-wallet-settings", getAppStore().storedPin);
        }
      });
    }

    return settings;
  }

  init() {
    this.initialized = true;
  }
}
