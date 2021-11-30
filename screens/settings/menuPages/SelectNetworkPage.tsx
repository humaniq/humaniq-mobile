import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { provider, useInstance } from "react-ioc";
import { Card, Colors, RadioButton, Text, View } from "react-native-ui-lib";
import { Screen } from "../../../components"
import { t } from "../../../i18n";
import { Header } from "../../../components/header/Header";
import React from "react";
import { ETHEREUM_NETWORKS, NETWORK_TYPE } from "../../../config/network";
import Ripple from "react-native-material-ripple";
import { getEthereumProvider } from "../../../App";
import * as storage from "../../../utils/localStorage"
import { runUnprotected } from "mobx-keystone";

export class SelectNetworkPageViewModel {
  constructor() {
    makeAutoObservable(this)
  }

  get mainNetworks() {
    return Object.values(ETHEREUM_NETWORKS).filter(n => n.env === NETWORK_TYPE.PRODUCTION)
  }

  get testNetworks() {
    return Object.values(ETHEREUM_NETWORKS).filter(n => n.env === NETWORK_TYPE.TEST)
  }

}

export const SelectNetwork = observer(() => {
  const view = useInstance(SelectNetworkPageViewModel)
  return <Screen style={ { height: "100%" } } preset={ "scroll" } backgroundColor={ Colors.bg }
                 statusBarBg={ Colors.bg }>
    <Header title={ t("settingsScreen.menu.network") }/>
    <View flex paddingV-20>
      <View row padding-16>
        <Text text16 robotoM>{ t("settingsScreen.menu.mainNets") }</Text>
      </View>
      <View row paddingH-16>
        <Card padding-0 flex>
          {
            view.mainNetworks.map((n, i) => {
              return <Ripple key={ n.name } rippleColor={ Colors.primary } style={ { padding: 12 } }
                             onPress={ async () => {
                               runUnprotected(() => {
                                 getEthereumProvider().currentNetworkName = n.name
                               })
                               storage.save("currentNetworkName", n.name)
                             } }
              >
                <View row>
                  <View flex-5>
                    <Text text16 style={ { textTransform: "capitalize" } }>{ n.name }</Text>
                  </View>
                  <View right flex-5>
                    <RadioButton
                        selected={ n.name === getEthereumProvider().currentNetworkName }
                        size={ 20 }
                        color={ n.name !== getEthereumProvider().currentNetworkName ? Colors.textGrey : Colors.primary }
                    />
                  </View>
                </View>
                { i !== 0 && <View absR style={ {
                  borderWidth: 1,
                  borderColor: Colors.grey,
                  width: "103%",
                  borderBottomColor: "transparent"
                } }/> }
              </Ripple>
            })
          }
        </Card>
      </View>
      <View row padding-16>
        <Text text16 robotoM>{ t("settingsScreen.menu.mainNets") }</Text>
      </View>
      <View row paddingH-16>
        <Card padding-0 flex>
          {
            view.testNetworks.map((n, i) => {
              return <Ripple key={ n.name } rippleColor={ Colors.primary } style={ { padding: 12 } }
                             onPress={ async () => {
                               runUnprotected(() => {
                                 getEthereumProvider().currentNetworkName = n.name
                               })
                               storage.save("currentNetworkName", n.name)
                             } }
              >
                <View row>
                  <View flex-5>
                    <Text text16 style={ { textTransform: "capitalize" } }>{ n.name }</Text>
                  </View>
                  <View right flex-5>
                    <RadioButton
                        selected={ n.name === getEthereumProvider().currentNetworkName }
                        size={ 20 }
                        color={ n.name !== getEthereumProvider().currentNetworkName ? Colors.textGrey : Colors.primary }
                    />
                  </View>
                </View>
                { i !== 0 && <View absR style={ {
                  borderWidth: 1,
                  borderColor: Colors.grey,
                  width: "103%",
                  borderBottomColor: "transparent"
                } }/> }
              </Ripple>
            })
          }
        </Card>
      </View>
    </View>

  </Screen>
})

export const SelectNetworkPage = provider()(SelectNetwork)
SelectNetworkPage.register(SelectNetworkPageViewModel)