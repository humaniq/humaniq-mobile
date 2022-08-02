import { observer } from "mobx-react-lite"
import React from "react"
import { useInstance } from "react-ioc"
import { SelectNetworkDialogViewModel } from "./SelectNetworkDialogViewModel"
import { ItemSelector } from "../../itemSelector/ItemSelector";
import { Colors, Modal } from "react-native-ui-lib";
import { getEVMProvider } from "../../../App";
import * as storage from "../../../utils/localStorage";
import { ICON_HEADER } from "../../header/Header";
import { t } from "../../../i18n";
import { runUnprotected } from "mobx-keystone";
import { ScrollView } from "react-native";

export const SelectNetworkDialog = observer(() => {
    const view = useInstance(SelectNetworkDialogViewModel)
    return <Modal
        onRequestClose={ () => {
            view.display = false
        } }
        animationType={ "slide" }
        visible={ view.display }
        testID={ 'selectNetworkModal' }
    >
        <ScrollView style={ { backgroundColor: Colors.bg } }>
            <ItemSelector backIcon={ ICON_HEADER.CROSS }
                          labelTransform={ (i) => i.name === "mainnet" ? "ETHEREUM" : i.name.toUpperCase() }
                          selected={ getEVMProvider().currentNetworkName } items={ view.networks }
                          headerTittle={ t("settingsScreen.menu.network") }
                          onPressItem={ async (n) => {
                              runUnprotected(() => {
                                  getEVMProvider().currentNetworkName = n.name
                              })
                              storage.save("currentNetworkName", n.name)
                              view.display = false
                          } }/>
        </ScrollView>
    </Modal>
})
