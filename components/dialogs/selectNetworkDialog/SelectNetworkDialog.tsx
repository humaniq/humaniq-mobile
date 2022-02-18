import { observer } from "mobx-react-lite"
import React from "react"
import { useInstance } from "react-ioc"
import { SelectNetworkDialogViewModel } from "./SelectNetworkDialogViewModel"
import { ItemSelector } from "../../itemSelector/ItemSelector";
import { Modal } from "react-native-ui-lib";
import { getEVMProvider } from "../../../App";
import * as storage from "../../../utils/localStorage";
import { ICON_HEADER } from "../../header/Header";
import { t } from "../../../i18n";

export const SelectNetworkDialog = observer(() => {
    const view = useInstance(SelectNetworkDialogViewModel)
    return <Modal
        onRequestClose={ () => {
            view.display = false
        } }
        animationType={ "slide" }
        visible={ view.display }
        testID={'selectNetworkModal'}
    >
        <ItemSelector selected={ getEVMProvider().currentNetworkName } backIcon={ ICON_HEADER.CROSS }
                      headerTittle={ t("settingsScreen.menu.network") }
                      onBackPress={ () => view.display = false } items={ view.networks }
                      onPressItem={
                          async (n) => {
                              // @ts-ignore
                              getEVMProvider().setCurrentNetworkName(n.name)
                              storage.save("currentNetworkName", n.name)
                              view.display = false
                          }
                      }/>
    </Modal>
})