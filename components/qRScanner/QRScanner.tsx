import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Appearance, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { RNCamera } from 'react-native-camera';
import { Colors, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { t } from "../../i18n";
import { provider, useInstance } from "react-ioc";
import { QRScannerView } from "./QRScannerView";
import { HIcon } from "../icon";

const styles = StyleSheet.create({
  closeIcon: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 42,
    width: 40
  },
  container: {
    backgroundColor: Colors.black,
    flex: 1
  },
  frame: {
    alignSelf: 'center',
    height: 250,
    justifyContent: 'center',
    marginTop: 100,
    opacity: 0.5,
    width: 250
  },
  innerView: {
    flex: 1
  },
  preview: {
    flex: 1
  },
  text: {
    color: Colors.white,
    flex: 1,
    fontSize: 17,
    justifyContent: 'center',
    marginTop: 100,
    textAlign: 'center'
  }
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
          onStatusChange={ view.onStatusChange }
      >
        <SafeAreaView style={ styles.innerView }>
          <TouchableOpacity style={ styles.closeIcon } onPress={ view.goBack }>
            <HIcon name={ 'cross' } size={ 16 } color={ Colors.white }/>
          </TouchableOpacity>
          <View flex bottom centerH paddingT-100>
            <HIcon name={ "frame" } size={ 244 } color={ Colors.white }/>
          </View>
          <View flex paddingH-90>
            <Text style={ styles.text }>{ t('qRScanner.scanning') }</Text>
          </View>
        </SafeAreaView>
      </RNCamera>
    </View>
  </>
})
export const QRScanner = provider()(QR)
QRScanner.register(QRScannerView)

