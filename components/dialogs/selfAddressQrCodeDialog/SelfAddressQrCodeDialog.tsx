import { Button, Colors, Dialog, LoaderScreen, Text, View } from "react-native-ui-lib"
import { runInAction } from "mobx"
import React from "react"
import { useInstance } from "react-ioc"
import { observer } from "mobx-react-lite"
import { SelfAddressQrCodeDialogViewModel } from "./SelfAddressQrCodeDialogViewModel"
import QRCode from "react-native-qrcode-svg"
import FAIcon from "react-native-vector-icons/FontAwesome5"
import { Clipboard } from "react-native"
import { DialogHeader } from "../dialogHeader/DalogHeader"

export const SelfAddressQrCodeDialog = observer(() => {
  const view = useInstance(SelfAddressQrCodeDialogViewModel);

  return <Dialog
    width={ "100%" }
    containerStyle={ { backgroundColor: Colors.grey80, borderTopLeftRadius: 30, borderTopRightRadius: 30 } }
    onDismiss={ () => runInAction(() => view.display = false) }
    visible={ view.display }
    bottom
  >
    <View>
        <DialogHeader onPressIn={ () => view.display = false }/>
      { !view.pending &&
      <View marginB-40 center>
        <View row center padding-10 paddingH-50>
          <Text text60 numberOfLines={1} margin-20>{ view.wallet?.address }</Text>
          <Button link borderRadius={ 4 } avoidMinWidth onPress={() => Clipboard.setString(view.wallet?.address)}>
            <FAIcon size={ 20 } name={ "copy" } />
          </Button>
        </View>
        <QRCode
          size={ 250 }
          value={ `ethereum:${ view.wallet?.address }` }
        />
      </View>
      }
      {
        view.pending &&
        <View marginH-30 marginV-10 height={ 200 }><LoaderScreen color={ Colors.grey20 } /></View>
      }
    </View>
  </Dialog>;
});
