import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Colors, LoaderScreen, View } from "react-native-ui-lib";
import { provider, useInstance } from "react-ioc";
import { BrowserScreenViewModel } from "./BrowserScreenViewModel";
import { Screen } from "../../components";
import { getBrowserStore } from "../../App";
import { TabsScreen } from "./tabs/TabsScreen";
import { BrowserTabScreen } from "./browserTab/BrowserTabScreen";
import { SelectWalletDialogViewModel } from "../../components/dialogs/selectWalletDialog/SelectWalletDialogViewModel";
import {
    SelectNetworkDialogViewModel
} from "../../components/dialogs/selectNetworkDialog/SelectNetworkDialogViewModel";
import { SelectWalletDialog } from "../../components/dialogs/selectWalletDialog/SelectWalletDialog";
import { SelectNetworkDialog } from "../../components/dialogs/selectNetworkDialog/SelectNetworkDialog";
import {
    ApprovalDappConnectDialogViewModel
} from "../../components/dialogs/approvalDappConnectDialog/ApprovalDappConnectDialogViewModel";

import {
    ApprovalDappConnectDialog
} from "../../components/dialogs/approvalDappConnectDialog/ApprovalDappConnectDialog";

const Browser = observer(() => {

    const { setActiveTab, closeTab, closeAllTabs, removeActiveTab } = getBrowserStore()
    const view = useInstance(BrowserScreenViewModel)

    useEffect(() => {
        view.init()
    }, [])

    return <Screen backgroundColor={ Colors.white }
                   statusBarBg={ getBrowserStore().showTabs ? Colors.white : Colors.bg }
                   preset="scroll"
                   style={ { minHeight: "100%" } }
    >
        <View testID={ 'browserScreen' }>
            { view.initialized &&
                getBrowserStore().showTabs && <TabsScreen
                    tabs={ view.tabs }
                    activeTab={ view.activeTab }
                    switchToTab={ setActiveTab }
                    newTab={ view.newTab }
                    closeTab={ closeTab }
                    closeTabsView={ removeActiveTab }
                    closeAllTabs={ closeAllTabs }
                />
            }
            {
                view.initialized && view.tabs.map(tab => <BrowserTabScreen
                    key={ `tab_${ tab.id }` }
                    id={ tab.id }
                    initialUrl={ tab.url }
                    showTabs={ view.showTabs }
                    newTab={ view.newTab }
                />)
            }
            <SelectWalletDialog/>
            <SelectNetworkDialog/>
            <ApprovalDappConnectDialog/>
        </View>
        { !view.initialized && <LoaderScreen/> }
    </Screen>
})

export const BrowserScreen = provider()(Browser)
BrowserScreen.register(
    BrowserScreenViewModel,
    SelectWalletDialogViewModel,
    SelectNetworkDialogViewModel,
    ApprovalDappConnectDialogViewModel,
)