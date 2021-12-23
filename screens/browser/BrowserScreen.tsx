import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Colors, LoaderScreen, View } from "react-native-ui-lib";
import { provider, useInstance } from "react-ioc";
import { BrowserScreenViewModel } from "./BrowserScreenViewModel";
import { Screen } from "../../components";
import { getBrowserStore } from "../../App";
import { TabsScreen } from "./tabs/TabsScreen";
import { BrowserTabScreen } from "./browserTab/BrowserTabScreen";
import { useNavigation } from "@react-navigation/native";

const Browser = observer(() => {

  const { setActiveTab, closeTab, closeAllTabs, removeActiveTab } = getBrowserStore()
  const view = useInstance(BrowserScreenViewModel)
  const nav = useNavigation()
  const [ showWebViews, setShowWebViews ] = useState(true)

  useEffect(() => {
    // Web Views crashing if they multiple in one moment. this is fix
    const unsubscribe = nav.addListener('focus', async () => {
      setTimeout(() => setShowWebViews(true), 10)
    })
    view.init()
    return () => unsubscribe()
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
          view.initialized && showWebViews && view.tabs.map(tab => <BrowserTabScreen
              key={ `tab_${ tab.id }` }
              id={ tab.id }
              initialUrl={ tab.url }
              showTabs={ view.showTabs }
              newTab={ view.newTab }
              changeAddress={ () => {
                setShowWebViews(false);
                nav.navigate("walletsList", { goBack: true }, null, null)
              } }
              changeNetwork={ () => {
                setShowWebViews(false);
                nav.navigate("selectNetwork", { goBack: true }, null, null)
              } }
          />)
      }
    </View>
    { !view.initialized && <LoaderScreen/> }
  </Screen>
})

export const BrowserScreen = provider()(Browser)
BrowserScreen.register(BrowserScreenViewModel)