import React from "react";
import { Card, Colors, RadioButton, Text, View } from "react-native-ui-lib";
import { Header, ICON_HEADER } from "../header/Header";
import { t } from "../../i18n";
import { getEthereumProvider } from "../../App";
import Ripple from "react-native-material-ripple";
import { ETHEREUM_NETWORK } from "../../config/network";

export interface ISelectNetworkProps {
  mainNetworks: Array<ETHEREUM_NETWORK>
  testNetworks: Array<ETHEREUM_NETWORK>
  onPressNetwork: (network: ETHEREUM_NETWORK) => void | Promise<void>
  onBackPress?: () => void
  backIcon?: ICON_HEADER
}

export const SelectNetwork: React.FC<ISelectNetworkProps> = ({
                                                               mainNetworks,
                                                               onPressNetwork,
                                                               onBackPress,
                                                               testNetworks,
                                                               backIcon
                                                             }) => {
  return <View flex bg-bg>
    <Header title={ t("settingsScreen.menu.network") } onBackPress={ onBackPress } icon={ backIcon }/>
    <View flex paddingV-20>
      <View row padding-16>
        <Text text16 robotoM>{ t("settingsScreen.menu.mainNets") }</Text>
      </View>
      <View row paddingH-16>
        <Card padding-0 flex>
          {
            mainNetworks.map((n, i) => {
              return <Ripple key={ n.name } rippleColor={ Colors.primary } style={ { padding: 12 } }
                             onPress={ () => onPressNetwork(n) }
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
            testNetworks.map((n, i) => {
              return <Ripple key={ n.name } rippleColor={ Colors.primary } style={ { padding: 12 } }
                             onPress={ () => onPressNetwork(n) }
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
  </View>
}