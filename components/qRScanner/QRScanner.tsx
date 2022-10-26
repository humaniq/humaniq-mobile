import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Appearance, StatusBar, StyleSheet } from "react-native";
import { RNCamera } from 'react-native-camera';
import { Colors, View } from "react-native-ui-lib";
import { t } from "../../i18n";
import { provider, useInstance } from "react-ioc";
import { QRScannerView } from "./QRScannerView";
import { QrScannerRoundedBoundary } from "./QrScannerRoundedBoundary";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black,
    flex: 1
  },
  preview: {
    flex: 1
  },
});

const QR = observer<{ route: any, navigation }>(({ route, navigation }) => {
  const view = useInstance(QRScannerView)

  useEffect(() => {
    view.init(route, navigation)
  }, [])

  return <>
    <StatusBar
        barStyle={ Appearance.getColorScheme() === "dark" ? "light-content" : "dark-content" }
        translucent backgroundColor="transparent"/>
    <View style={ styles.container }>
      <RNCamera
          onMountError={ view.onError }
          captureAudio={ false }
          style={ styles.preview }
          type={ RNCamera.Constants.Type.back }
          onBarCodeRead={ view.shouldReadBarCode ? view.onBarCodeRead : null }
          flashMode={ RNCamera.Constants.FlashMode.auto }
          androidCameraPermissionOptions={ {
            title: t("qRScanner.allowDialog.title"),
            message: t('qRScanner.allowDialog.message'),
            buttonPositive: t('common.allow'),
            buttonNegative: t('common.deny')
          } }
          onStatusChange={ view.onStatusChange }>
          <QrScannerRoundedBoundary closeButtonOnClick={ view.goBack }
                                    bottomButtonOnClick={ view.openQRImageFromGallery }
                                    bottomButtonTitle={ t('qRScanner.chooseFromGallery') }
                                    helperText={ t('qRScanner.scanning') }/>
      </RNCamera>
    </View>
  </>
})
export const QRScanner = provider()(QR)
QRScanner.register(QRScannerView)
