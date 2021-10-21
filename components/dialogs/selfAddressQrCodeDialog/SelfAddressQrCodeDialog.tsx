import { Button, Colors, Dialog, LoaderScreen, Text, View } from "react-native-ui-lib"
import { runInAction } from "mobx"
import React from "react"
import { useInstance } from "react-ioc"
import { observer } from "mobx-react-lite"
import { SelfAddressQrCodeDialogViewModel } from "./SelfAddressQrCodeDialogViewModel"
import QRCode from "react-native-qrcode-svg"
import { DialogHeader } from "../dialogHeader/DalogHeader"
import { t } from "../../../i18n";
import Clipboard from "@react-native-clipboard/clipboard";
import { runUnprotected } from "mobx-keystone";
import { getAppStore } from "../../../App";
import { TOASTER_TYPE } from "../../../store/app/AppStore";

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
      <View margin-24 center>
          <QRCode
              size={ 203 }
              value={ `ethereum:${ view.wallet?.address }` }
          />
          <View row center padding-20>
              <Text center robotoR>
                { t("selfAddressQRCodeDialog.description") }
              </Text>
          </View>
          <View row center>
              <Button labelStyle={ { fontFamily: "Roboto-Bold" } } link
                      label={ t("selfAddressQRCodeDialog.copyAddress") }
                      onPress={ () => {
                        Clipboard.setString(view.wallet?.address)
                        runUnprotected(() => {
                          view.display = false
                          getAppStore().toast.type = TOASTER_TYPE.SUCCESS
                          getAppStore().toast.message = t("appToasts.addressCopied")
                          getAppStore().toast.display = true
                        })
                        setTimeout(() => {
                          runUnprotected(() => {
                            getAppStore().toast.display = false
                            getAppStore().toast.type = TOASTER_TYPE.PENDING
                            getAppStore().toast.message = ""
                          })
                        }, 3000)
                      } }
              />
          </View>
          <View row center paddingT-20>
              <Button flex fullWidth style={ { borderRadius: 12 } }
                      label={ t("selfAddressQRCodeDialog.shareAddress") }/>
          </View>
      </View>
      }
      {
        view.pending &&
        <View marginH-30 marginV-10 height={ 200 }><LoaderScreen color={ Colors.grey20 }/></View>
      }
    </View>
  </Dialog>;
});
