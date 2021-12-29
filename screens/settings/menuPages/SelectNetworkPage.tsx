import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { provider, useInstance } from "react-ioc";
import { Colors } from "react-native-ui-lib";
import { Screen } from "../../../components"
import React from "react";
import { ETHEREUM_NETWORKS, NETWORK_TYPE } from "../../../config/network";
import { getEthereumProvider } from "../../../App";
import * as storage from "../../../utils/localStorage"
import { runUnprotected } from "mobx-keystone";
import { useNavigation } from "@react-navigation/native";
import { SelectNetwork as SN } from "../../../components/selectNetwork/SelectNetwork";

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
  const nav = useNavigation()
  return <Screen style={ { height: "100%" } } preset={ "scroll" } backgroundColor={ Colors.bg }
                 statusBarBg={ Colors.bg }>
    <SN mainNetworks={ view.mainNetworks } testNetworks={ view.testNetworks } onPressNetwork={ async (n) => {
      runUnprotected(() => {
        getEthereumProvider().currentNetworkName = n.name
      })
      storage.save("currentNetworkName", n.name)
      nav.goBack()
    } }/>
  </Screen>
})

export const SelectNetworkPage = provider()(SelectNetwork)
SelectNetworkPage.register(SelectNetworkPageViewModel)