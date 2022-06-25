import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { provider, useInstance } from "react-ioc";
import { Colors } from "react-native-ui-lib";
import { Screen } from "../../../components"
import React from "react";
import { getWalletStore } from "../../../App";
import * as storage from "../../../utils/localStorage"
import { useNavigation } from "@react-navigation/native";
import { ItemSelector } from "../../../components/itemSelector/ItemSelector";
import { t } from "../../../i18n";
import { CURRENCIES_ARR } from "../../../config/common";
import { ON_TOP_ITEM, SHOW_GRAPHS } from "../../../store/wallet/WalletStore";
import { Header } from "../../../components/header/Header";
import { toUpperCase } from "../../../utils/general";


export class SelectCurrencyPageViewModel {
    constructor() {
        makeAutoObservable(this)
    }

    get currencies() {
        return [
            { items: CURRENCIES_ARR.map(i => ({ name: i })) },
        ]
    }

    get fiatOnTopItems() {
        return [ {
            items: [
                { name: t('settingsScreen.menu.fiatPrimary'), value: ON_TOP_ITEM.FIAT },
                { name: t('settingsScreen.menu.tokenPrimary'), value: ON_TOP_ITEM.TOKEN }
            ]
        } ]
    }

    get showGraphItems() {
        return [ {
            items: [
                { name: t('settingsScreen.menu.charts'), value: SHOW_GRAPHS.GRAPH },
                { name: t('settingsScreen.menu.tokenPrice'), value: SHOW_GRAPHS.TOKEN }
            ]
        } ]
    }

}

export const SelectCurrency = observer(() => {
    const view = useInstance(SelectCurrencyPageViewModel)
    const nav = useNavigation()
    return <Screen style={ { minHeight: "100%" } } preset={ "scroll" } backgroundColor={ Colors.bg }
                   statusBarBg={ Colors.bg }>
        <Header backEnabled={ true } title={ t("settingsScreen.menu.displayOptions") }/>
        <ItemSelector headerTittle={ t("settingsScreen.menu.fiatCurrency") }
                      selected={ getWalletStore().currentFiatCurrency } items={ view.currencies }
                      onPressItem={ async (n) => {
                          // @ts-ignore
                          getWalletStore().setCurrentFiatCurrency(n.name)
                          storage.save("currentFiatCurrency", n.name)
                          nav.goBack()
                      } }
                      labelTransform={(item) => toUpperCase(item.name)}
                      backEnabled={ false }
        />
        <ItemSelector headerTittle={ t("settingsScreen.menu.balanceDisplay") }
                      selected={ getWalletStore().onTopCurrency } items={ view.fiatOnTopItems }
                      onPressItem={ async (n) => {
                          // @ts-ignore
                          getWalletStore().setOnTopCurrency(n.value || n.name)
                          storage.save("hm-wallet-settings-fiat-on-top", n.value || n.name)
                          nav.goBack()
                      } }
                      backEnabled={ false }
        />
        <ItemSelector headerTittle={ t("settingsScreen.menu.infoDisplay") }
                      selected={ getWalletStore().showGraphs } items={ view.showGraphItems }
                      onPressItem={ async (n) => {
                          // @ts-ignore
                          getWalletStore().setShowGraphs(n.value || n.name)
                          storage.save("hm-wallet-settings-show-graphs", n.value || n.name)
                          nav.goBack()
                      } }
                      backEnabled={ false }
        />
    </Screen>
})

export const SelectCurrencyPage = provider()(SelectCurrency)
SelectCurrencyPage.register(SelectCurrencyPageViewModel)