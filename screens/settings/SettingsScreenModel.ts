import { makeAutoObservable } from "mobx"
import { ETH_NETWORKS } from "../../config/network"
import * as storage from "../../utils/localStorage"
import { localStorage } from "../../utils/localStorage"
import { runUnprotected } from "mobx-keystone"
import { t } from "../../i18n"
import { inject } from "react-ioc"
import { ExportMnemonicDialogViewModel } from "../../components/dialogs/exportMnemonicDialog/ExportMnemonicDialogViewModel"
import { ethereumProvider, getAppStore, getEthereumProvider, getProfileStore } from "../../App"

export class SettingsScreenModel {

    initialized = false

    settingsDialog = {
        title: "RRR",
        display: false,
        options: []
    }

    exportMnemonic = inject(this, ExportMnemonicDialogViewModel)

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.init()
    }

    get isAllInitialized() {
        return this.initialized && !!getProfileStore().initialized
    }

    get settingsMenu() {
        const settings = [ {
            id: 1,
            type: "actionSheet",
            name: t("settingsScreen.menu.ethNetwork"),
            currentValue: ethereumProvider.getDefault().currentNetworkName,
            icon: "link",
            onPress: (val?: any) => {
                this.settingsDialog.title = "Выбрать сеть"
                this.settingsDialog.display = true
                this.settingsDialog.options = Object.values(ETH_NETWORKS).map(i => ({
                    label: i, onPress: () => {
                        runUnprotected(() => {
                            getEthereumProvider().currentNetworkName = i
                        })
                        storage.save("currentNetworkName", i)
                    }
                }))
            }
        }, {
            id: 2,
            type: "dialog",
            name: t("settingsScreen.menu.exportMnemonic"),
            icon: "key",
            onPress: () => {
                this.exportMnemonic.display = true
            }
        } ]

        if (__DEV__ && getAppStore().savedPin) {
            settings.push({
                id: 99,
                type: "toggle",
                name: "Отключить пинкод",
                currentValue: !!getAppStore().storedPin,
                icon: "lock",
                onPress: (val?: boolean) => {
                    console.log(getAppStore().storedPin)
                    runUnprotected(() => {
                        getAppStore().storedPin = val ? getAppStore().savedPin : false
                    })
                    localStorage.save("hm-wallet-settings", getAppStore().storedPin)
                }
            })
        }

        return settings
    }

    init() {
        this.initialized = true
    }
}
