import React from "react";
import { observer } from "mobx-react-lite";
import { Colors, Image, Text, View } from "react-native-ui-lib";
import { BrowserTab } from "../../../store/browser/BrowserStore";
import { getHost } from "../../../utils/browser";
import { DAPPS_CONFIG } from "../../../config/dapp";
import { Dimensions, StyleSheet } from "react-native";
import { t } from "../../../i18n";
import { HIcon } from "../../../components/icon";
import Ripple from "react-native-material-ripple"

export interface ITabsScreenProps {
  tabs: Array<BrowserTab>
  activeTab: BrowserTab
  switchToTab: (id: string) => any
  newTab: (url?: string) => any
  closeTab: (id: string) => any
  closeTabsView: () => any
  closeAllTabs: () => any
}

const margin = 15;
const width = Dimensions.get('window').width / 2 - margin * 2;
const height = Dimensions.get('window').height / 3.2

export const TabsScreen = observer<ITabsScreenProps>((props) => {

  return <View style={ { minHeight: "100%" } }>
      <Ripple rippleColor={ Colors.primary } onPress={ () => props.newTab() }
              style={ {
                  alignSelf: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
              } }>
          <HIcon name={ "plus" } size={ 18 }/>
          <Text numberOfLines={ 1 } text20 marginL-20 robotoM>
              { t("browserScreen.newTab") }
          </Text>
      </Ripple>
    <View row padding-20 style={ { flexWrap: "wrap" } }>
      {
        props.tabs.map((tab, index) => {
          const hostname = getHost(tab.url);
          const isHomepage = hostname === getHost(DAPPS_CONFIG.HOMEPAGE_HOST);
          return <View key={ tab.id } style={ { overflow: "hidden", display: "flex", margin: 5, } }>
            <View
                style={ {
                  display: "flex",
                  borderRadius: 16,
                  justifyContent: "space-evenly",
                  alignItems: 'center',
                  overflow: 'hidden',
                  width,
                  height,
                } }
                backgroundColor={ props.activeTab === tab.id ? Colors.primary : Colors.greyLight }
            >
              <View row spread centerV paddingH-10 width={ "100%" } style={ { zIndex: 20 } }
                    backgroundColor={ props.activeTab === tab.id ? Colors.primary : Colors.greyLight }>
                <Image source={ { uri: tab.icon } } style={ { width: 20, height: 20 } }/>
                <View paddingL-10 style={ { width: "70%" } }>
                  <Text robotoM numberOfLines={ 1 } color={ props.activeTab === tab.id ? Colors.white : Colors.black }>
                    { isHomepage ? t("browserScreen.newTab") : hostname }
                  </Text>
                </View>
                <Ripple onPress={ () => props.closeTab(tab.id) } rippleColor={ Colors.primary }
                        style={ { paddingVertical: 14, paddingLeft: 10, paddingRight: 4 } }>
                  <HIcon name={ "cross" }
                         color={ props.activeTab === tab.id ? Colors.white : Colors.black }/></Ripple>
              </View>
              <Ripple style={ {
                width: width - 10,
                backgroundColor: Colors.white,
                flex: 1,
                borderTopRightRadius: 12,
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                marginBottom: 5,
                overflow: 'hidden',
              } }
                      rippleColor={ Colors.primary }
                      onPress={ () => props.switchToTab(tab.id) }
              >
                <Image source={ { uri: tab.image } }
                       style={ {
                         ...StyleSheet.absoluteFillObject,
                       } }
                       resizeMode={ "cover" }
                />
              </Ripple>
            </View>
          </View>
        })
      }
    </View>
  </View>
})