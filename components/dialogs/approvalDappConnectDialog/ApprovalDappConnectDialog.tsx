import { Button, Card, Colors, Dialog, LoaderScreen, Text, View } from "react-native-ui-lib"
import React from "react"
import { useInstance } from "react-ioc"
import { observer } from "mobx-react-lite"
import { DialogHeader } from "../dialogHeader/DalogHeader"
import { ApprovalDappConnectDialogViewModel } from "./ApprovalDappConnectDialogViewModel"
import { t } from "../../../i18n"
import { getWalletStore } from "../../../App"
import { WalletItem } from "../../walletItem/WalletItem";

export const ApprovalDappConnectDialog = observer(() => {
  const view = useInstance(ApprovalDappConnectDialogViewModel)

  return <Dialog
      ignoreBackgroundPress
      width={ "100%" }
      containerStyle={ { backgroundColor: Colors.grey80, borderTopLeftRadius: 30, borderTopRightRadius: 30 } }
      visible={ view.display }
      bottom
  >
    <View bg-bg>
      <DialogHeader onPressIn={ () => view.display = false }/>
      { !view.pending &&
          <View padding-20>
              <View row>
                  <Text
                        text16 robotoM> { `${ t("approvalDappConnectDialog.wontToConnect") }${ view.hostName }` } </Text>
              </View>
              <View row paddingV-20>
                  <Text grey30 text80>{ t('approvalDappConnectDialog.attention') }</Text>
              </View>
              <View row>
                  <Card width={ "100%" }><WalletItem wallet={ getWalletStore().selectedWallet }/></Card>
              </View>
              <View row width={ "100%" } center paddingT-40>
                  <Button onPress={ view.onAccountsRejected } link br50 bg-primary marginB-20 robotoM
                          label={ t('approvalDappConnectDialog.deny') }/>
              </View>
              <View width={ "100%" }>
                  <Button onPress={ view.onAccountsConfirm } marginH-10 fullWidth style={ { borderRadius: 12 } }
                          label={ t('approvalDappConnectDialog.allow') }/>
              </View>
          </View>
      }
      {
          view.pending &&
          <View marginH-30 marginV-10 height={ 200 }><LoaderScreen color={ Colors.grey20 }/></View>
      }
    </View>
  </Dialog>
})
