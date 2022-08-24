import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { provider, useInstance } from "react-ioc";
import { Button, Colors, View } from "react-native-ui-lib";
import { Screen } from "../../../components"
import React, { useEffect } from "react";
import { getWalletStore } from "../../../App";
import * as storage from "../../../utils/localStorage"
import { useNavigation } from "@react-navigation/native";
import { ItemSelector } from "../../../components/itemSelector/ItemSelector";
import { t } from "../../../i18n";
import { CURRENCIES_ARR } from "../../../config/common";
import { ON_TOP_ITEM, SHOW_GRAPHS } from "../../../store/wallet/WalletStore";
import { Header } from "../../../components/header/Header";
import { toUpperCase } from "../../../utils/general";
import { runUnprotected } from "mobx-keystone";


export class SelectCurrencyPageViewModel {
    constructor() {
        makeAutoObservable(this)
    }

    nav

    latestCurrency
    latestFiatOnTop
    latestShowGraphItems

    save = () => {
        this.nav.goBack()
    }

    cancel = () => {
        runUnprotected(() => {
            getWalletStore().currentFiatCurrency = this.latestCurrency
            getWalletStore().onTopCurrency = this.latestFiatOnTop
            getWalletStore().showGraphs = this.latestShowGraphItems
        })

        this.nav.goBack()
    }

    init = (nav: any) => {
        this.nav = nav
        this.latestCurrency = getWalletStore().currentFiatCurrency
        this.latestFiatOnTop = getWalletStore().onTopCurrency
        this.latestShowGraphItems = getWalletStore().showGraphs
    }

    get disabled() {
        return !(this.latestCurrency !== getWalletStore().currentFiatCurrency ||
            this.latestFiatOnTop !== getWalletStore().onTopCurrency ||
            this.latestShowGraphItems !== getWalletStore().showGraphs)

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

    useEffect(() => {
        view.init(nav)
    }, [])


    return <Screen style={ { minHeight: "100%" } } preset={ "scroll" } backgroundColor={ Colors.bg }
                   statusBarBg={ Colors.bg }>
        <Header onBackPress={ view.cancel } backEnabled={ true } title={ t("settingsScreen.menu.displayOptions") }/>
        <ItemSelector headerTittle={ t("settingsScreen.menu.fiatCurrency") }
                      selected={ getWalletStore().currentFiatCurrency } items={ view.currencies }
                      onPressItem={ async (n) => {
                          // @ts-ignore
                          getWalletStore().setCurrentFiatCurrency(n.name)
                          storage.save("currentFiatCurrency", n.name)
                      } }
                      labelTransform={ (item) => toUpperCase(item.name) }
                      backEnabled={ false }
                      backPressEnabled={ false }
                      headerLabelSize={ 17 }
        />
        <ItemSelector headerTittle={ t("settingsScreen.menu.balanceDisplay") }
                      selected={ getWalletStore().onTopCurrency } items={ view.fiatOnTopItems }
                      onPressItem={ async (n) => {
                          // @ts-ignore
                          getWalletStore().setOnTopCurrency(n.value || n.name)
                          storage.save("hm-wallet-settings-fiat-on-top", n.value || n.name)
                      } }
                      backEnabled={ false }
                      backPressEnabled={ false }
                      headerLabelSize={ 17 }
        />
        <ItemSelector headerTittle={ t("settingsScreen.menu.infoDisplay") }
                      selected={ getWalletStore().showGraphs } items={ view.showGraphItems }
                      onPressItem={ async (n) => {
                          // @ts-ignore
                          getWalletStore().setShowGraphs(n.value || n.name)
                          storage.save("hm-wallet-settings-show-graphs", n.value || n.name)
                      } }
                      backEnabled={ false }
                      backPressEnabled={ false }
                      headerLabelSize={ 17 }
        />
        <View flex bottom centerH paddingB-16 paddingH-16>
            <Button
                onPress={ view.save }
                disabled={ view.disabled }
                style={ { width: "100%", borderRadius: 12 } }
                label={ t("common.save") }
            />
        </View>
    </Screen>
})

export const SelectCurrencyPage = provider()(SelectCurrency)
SelectCurrencyPage.register(SelectCurrencyPageViewModel)
