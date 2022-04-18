import { makeAutoObservable } from "mobx";
import { InteractionManager } from "react-native";
import { failedSeedPhraseRequirements } from "../../utils/validators";
import { ethers } from "ethers";
import { parse } from 'eth-url-parser';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import RNQRGenerator from 'rn-qr-generator';
import NativeToast from "../toasts/nativeToast/NativeToast";
import { t } from "../../i18n";
import { isEmpty } from "../../utils/general";

export class QRScannerView {
  constructor() {
    makeAutoObservable(this, null, { autoBind: true })
  }

  navigation
  route
  initialized = false;
  shouldReadBarCode = true;

  init = (route, navigation) => {
    this.route = route
    this.navigation = navigation
    this.initialized = true
  }

  onError = (error) => {
    this.navigation.goBack();
    InteractionManager.runAfterInteractions(() => {
      if (this.route.params.onScanError && error) {
        this.route.params.onScanError(error.message);
      }
    });
  }

  goBack = () => {
    this.navigation.goBack();
    if (this.route.params.onScanError) {
      this.route.params.onScanError('USER_CANCELLED');
    }
  }

  end = (data, content) => {
    this.initialized = false;
    this.navigation.goBack();
    this.route.params.onScanSuccess(data, content);
  }

  onBarCodeRead = (response) => {
    if (!this.initialized) return false;
    const content = response.data;

    if (!content) return false;

    let data = {};

    // if (content.split('metamask-sync:').length > 1) {
    //   this.shouldReadBarCode = false;
    //   data = { content };
    //   if (this.props.route.params.onStartScan) {
    //     this.props.route.params.onStartScan(data).then(() => {
    //       this.props.route.params.onScanSuccess(data);
    //     });
    //     this.mounted = false;
    //   } else {
    //     Alert.alert(strings('qr_scanner.error'), strings('qr_scanner.attempting_sync_from_wallet_error'));
    //     this.mounted = false;
    //   }
    // } else {

    if (!failedSeedPhraseRequirements(content) && ethers.utils.isValidMnemonic(content)) {
      this.shouldReadBarCode = false;
      data = { seed: content };
      this.end(data, content);
      return null;
    }

    // const { KeyringController } = Engine.context;
    // const isUnlocked = KeyringController.isUnlocked();
    //
    // if (!isUnlocked) {
    //   this.props.navigation.goBack();
    //   Alert.alert(strings('qr_scanner.error'), strings('qr_scanner.attempting_to_scan_with_wallet_locked'));
    //   this.mounted = false;
    //   return;
    // }

    // Let ethereum:address go forward
    if (content.split('ethereum:').length > 1 && !parse(content).function_name) {
      this.shouldReadBarCode = false;
      data = parse(content);
      const action = 'send-eth';
      data = { ...data, action };
      this.initialized = false;
      this.navigation.goBack();
      this.route.params.onScanSuccess(data, content);
      return true;
    }

    // Checking if it can be handled like deeplinks
    // const handledByDeeplink = SharedDeeplinkManager.parse(content, {
    //   origin: AppConstants.DEEPLINKS.ORIGIN_QR_CODE,
    //   onHandled: () => this.props.navigation.pop(2)
    // });
    //
    // if (handledByDeeplink) {
    //   this.mounted = false;
    //   return;
    // }

    // I can't be handled by deeplinks, checking other options
    if (content.length === 64 || (content.substring(0, 2).toLowerCase() === '0x' && content.length === 66)) {
      this.shouldReadBarCode = false;
      data = { private_key: content.length === 64 ? content : content.substr(2) };
    } else if (content.substring(0, 2).toLowerCase() === '0x') {
      this.shouldReadBarCode = false;
      data = { target_address: content, action: 'send-eth' };
    } else if (content.split('wc:').length > 1) {
      this.shouldReadBarCode = false;
      data = { walletConnectURI: content, action: 'wallet-connect' };
    } else {
      // EIP-945 allows scanning arbitrary data
      data = content;
    }
    // }

    this.end(data, content);
    return true
  }

  onStatusChange = (event) => {
    if (event.cameraStatus === 'NOT_AUTHORIZED') {
      this.navigation.goBack();
    }
  }

  openQRImageFromGallery = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 0.3
    };

    try {
      const result = await launchImageLibrary(options);

      if (!result || result.errorCode || !result.assets || result.assets.length === 0) {
        return;
      }

      const decodedQRResult = await RNQRGenerator.detect({
        uri: result.assets[0].uri
      })

      if (decodedQRResult.values.length > 0) {
        const possiblyDetectedQRCode = decodedQRResult.values[0]

        if (isEmpty(possiblyDetectedQRCode)) {
          NativeToast.show(t("qRScanner.qrCodeDetectionError"))
          return
        }
        this.onBarCodeRead({ data: possiblyDetectedQRCode })
      } else {
        NativeToast.show(t("qRScanner.qrCodeDetectionError"))
      }
    } catch (e) {}
  }
}