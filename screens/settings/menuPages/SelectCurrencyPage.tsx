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

export class SelectCurrencyPageViewModel {
    constructor() {
        makeAutoObservable(this)
    }

    get currencies() {
        return [
            { items: CURRENCIES_ARR.map(i => ({ name: i })) },
        ]
    }

}

export const SelectCurrency = observer(() => {
    const view = useInstance(SelectCurrencyPageViewModel)
    const nav = useNavigation()
    return <Screen style={ { minHeight: "100%" } } preset={ "scroll" } backgroundColor={ Colors.bg }
                   statusBarBg={ Colors.bg }>
        <ItemSelector headerTittle={ t("settingsScreen.menu.currency") }
                      selected={ getWalletStore().currentFiatCurrency } items={ view.currencies }
                      onPressItem={ async (n) => {
                          // @ts-ignore
                          getWalletStore().setCurrentFiatCurrency(n.name)
                          storage.save("currentFiatCurrency", n.name)
                          nav.goBack()
                      } }/>
    </Screen>
})

export const SelectCurrencyPage = provider()(SelectCurrency)
SelectCurrencyPage.register(SelectCurrencyPageViewModel)