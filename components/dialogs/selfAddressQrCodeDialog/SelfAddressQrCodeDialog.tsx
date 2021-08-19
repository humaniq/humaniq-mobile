import { Button, Colors, Dialog, LoaderScreen, View } from "react-native-ui-lib";
import { runInAction } from "mobx";
import React from "react";
import { useInstance } from "react-ioc";
import { observer } from "mobx-react-lite";
import { t } from "../../../i18n";
import { TextField } from "react-native-ui-lib";
import { SelfAddressQrCodeDialogViewModel } from "./SelfAddressQrCodeDialogViewModel";

export const SelfAddressQrCodeDialog = observer(() => {
  const view = useInstance(SelfAddressQrCodeDialogViewModel);
  
  return <Dialog
    width={ "100%" }
    containerStyle={ { backgroundColor: Colors.grey80 } }
    onDismiss={ () => runInAction(() => view.display = false) }
    visible={ view.display }
    bottom
  >
    <View>
      <View row paddingV-10 center>
        <View flex right paddingH-20 paddingV-5>
          <Button onPress={ () => view.display = false } link
                  label={ t("common.cancel") } />
        </View>
      </View>
      { !view.pending &&
      <View marginB-20>
        <TextField />
      </View>
      }
      {
        view.pending &&
        <View marginH-30 marginV-10 height={ 200 }><LoaderScreen color={ Colors.grey20 } /></View>
      }
    </View>
  </Dialog>;
});
