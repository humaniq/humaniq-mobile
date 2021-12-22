import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Colors, LoaderScreen, View } from "react-native-ui-lib";
import { provider, useInstance } from "react-ioc";
import { BrowserScreenViewModel } from "./BrowserScreenViewModel";
import { Screen } from "../../components";
import { getBrowserStore } from "../../App";
import { TabsScreen } from "./tabs/TabsScreen";
import { BrowserTabScreen } from "./browserTab/BrowserTabScreen";

const Browser = observer(() => {

  const { setActiveTab, closeTab, closeAllTabs, removeActiveTab } = getBrowserStore()
  const view = useInstance(BrowserScreenViewModel)

  useEffect(() => {
    view.init()
  }, [])

  return <Screen backgroundColor={ Colors.bg } statusBarBg={ Colors.bg }
                 preset="scroll"
                 style={ { minHeight: "100%" } }
  >
    <View>
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
          view.initialized  && view.tabs.map(tab => <BrowserTabScreen
              key={ `tab_${ tab.id }` }
              id={ tab.id }
              initialUrl={ tab.url }
              showTabs={ view.showTabs }
              newTab={ view.newTab }
          />)
      }
    </View>
    { !view.initialized && <LoaderScreen/> }
  </Screen>
})

export const BrowserScreen = provider()(Browser)
BrowserScreen.register(BrowserScreenViewModel)