import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { provider, useInstance } from "react-ioc";
import { Colors } from "react-native-ui-lib";
import { Screen } from "../../../components"
import React from "react";
import { EVM_NETWORKS, NATIVE_COIN, NETWORK_TYPE } from "../../../config/network";
import { getEVMProvider } from "../../../App";
import * as storage from "../../../utils/localStorage"
import { runUnprotected } from "mobx-keystone";
import { useNavigation } from "@react-navigation/native";
import { ItemSelector } from "../../../components/itemSelector/ItemSelector";
import { t } from "../../../i18n";

export class SelectNetworkPageViewModel {
    constructor() {
        makeAutoObservable(this)
    }

    get networks() {
        return [
            {
                tittle: t("settingsScreen.menu.mainNets"),
                items: Object.values(EVM_NETWORKS).filter(n => n.env === NETWORK_TYPE.PRODUCTION)
            },
            {
                tittle: t("settingsScreen.menu.testNets"),
                items: Object.values(EVM_NETWORKS).filter(n => n.env === NETWORK_TYPE.TEST && n.nativeCoin === NATIVE_COIN.ETHEREUM)
            },
            {
                tittle: t("settingsScreen.menu.bscNets"),
                items: Object.values(EVM_NETWORKS).filter(n => n.env === NETWORK_TYPE.TEST && n.nativeCoin === NATIVE_COIN.BINANCECOIN)
            }
        ]
    }
}

export const SelectNetwork = observer(() => {
    const view = useInstance(SelectNetworkPageViewModel)
    const nav = useNavigation()
    return <Screen style={ { minHeight: "100%" } } preset={ "scroll" } backgroundColor={ Colors.bg }
                   statusBarBg={ Colors.bg }>
        <ItemSelector labelTransform={ (i) => i.name === "mainnet" ? "ETHEREUM" : i.name.toUpperCase() }
                      selected={ getEVMProvider().currentNetworkName } items={ view.networks }
                      headerTittle={ t("settingsScreen.menu.network") }
                      onPressItem={ async (n) => {
                          runUnprotected(() => {
                              getEVMProvider().currentNetworkName = n.name
                          })
                          storage.save("currentNetworkName", n.name)
                          nav.goBack()
                      } }/>
    </Screen>
})

export const SelectNetworkPage = provider()(SelectNetwork)
SelectNetworkPage.register(SelectNetworkPageViewModel)