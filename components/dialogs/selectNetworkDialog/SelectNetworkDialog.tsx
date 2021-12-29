import { observer } from "mobx-react-lite"
import React from "react"
import { useInstance } from "react-ioc"
import { SelectNetworkDialogViewModel } from "./SelectNetworkDialogViewModel"
import { SelectNetwork } from "../../selectNetwork/SelectNetwork";
import { Modal } from "react-native-ui-lib";
import { runUnprotected } from "mobx-keystone";
import { getEthereumProvider } from "../../../App";
import * as storage from "../../../utils/localStorage";

export const SelectNetworkDialog = observer(() => {
  const view = useInstance(SelectNetworkDialogViewModel)
  return <Modal
      onRequestClose={ () => {
        view.display = false
      } }
      animationType={ "slide" }
      visible={ view.display }>
    <SelectNetwork onBackPress={ () => view.display = false } mainNetworks={ view.mainNetworks }
                   testNetworks={ view.testNetworks } onPressNetwork={
      async (n) => {
        runUnprotected(() => {
          getEthereumProvider().currentNetworkName = n.name
        })
        storage.save("currentNetworkName", n.name)
        view.display = false
      }
    }/>
  </Modal>
})