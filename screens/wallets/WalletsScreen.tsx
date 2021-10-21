import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Button, Colors, LoaderScreen, View } from "react-native-ui-lib";
import { provider, useInstance } from "react-ioc";
import { WalletsScreenModel } from "./WalletsScreenModel";
import { WalletMenuDialogViewModel } from "../../components/dialogs/menuWalletDialog/WalletMenuDialogViewModel";
import { Screen } from "../../components";
import Carousel from 'react-native-snap-carousel';
import { Dimensions } from "react-native";
import { t } from "../../i18n";
import { WalletTittle } from "./wallet/WalletTittle";
import { WalletBody } from "./wallet/WalletBody";
import { WalletTabs } from "./wallet/WalletTabs";
import { WalletTransactionControls } from "./wallet/WalletTransactionControls";
import { SelfAddressQrCodeDialogViewModel } from "../../components/dialogs/selfAddressQrCodeDialog/SelfAddressQrCodeDialogViewModel";
import { WalletMenuDialog } from "../../components/dialogs/menuWalletDialog/WalletMenuDialog";
import { SelfAddressQrCodeDialog } from "../../components/dialogs/selfAddressQrCodeDialog/SelfAddressQrCodeDialog";
import { BlurWrapper } from "../../components/blurWrapper/BlurWrapper"
import { SendWalletTransactionViewModel } from "../../components/dialogs/sendWalletTransactionDialog/SendWalletTransactionViewModel";
import { useNavigation } from "@react-navigation/native";

const renderBody = ({ item }) => <WalletBody { ...item } />

const renderTittle = ({ item }) => <WalletTittle { ...item } />

const Wallets = observer<{ route: any }>(function ({ route }) {

  const view = useInstance(WalletsScreenModel)
  const nav = useNavigation()
  const walletMenu = useInstance(WalletMenuDialogViewModel)
  const sendTransactionDialog = useInstance(SendWalletTransactionViewModel)
  const selfAddressQrCodeDialogViewModel = useInstance(SelfAddressQrCodeDialogViewModel)

  const carouselTittleRef = useRef<Carousel<any>>()
  const carouselBodyRef = useRef<Carousel<any>>()

  useEffect(() => {
    view.init()
  }, [])

  useEffect(() => {
    if (route.params?.index) {
      carouselTittleRef.current.snapToItem(+route.params.index)
    }
  }, [ route ])

  return <BlurWrapper
      before={ <Screen
          backgroundColor={ Colors.bg } statusBarBg={ Colors.bg }
          preset="scroll"
          refreshing={ view.refreshing }
          onRefresh={ view.onRefresh }
          style={ !view.allInitialized ? { height: "100%" } : {} }
      >
        <>
          { !view.allInitialized && <View height={ "100%" } center><LoaderScreen/></View> }
          { view.allInitialized && <>
              <View paddingT-20 paddingL-16 left>
                  <Button link textM primary label={ t('walletScreen.allAddresses') }
                          onPress={ () => nav.navigate("walletsList") }
                  />
              </View>
              <View paddingB-20>
                  <View height={ 100 }>
                      <Carousel
                          vertical={ false }
                          useScrollView={ true }
                          useExperimentalSnap={ true }
                          shouldOptimizeUpdates
                          inactiveSlideScale={ 1 }
                          layout={ "default" }
                          ref={ carouselTittleRef }
                          data={ view.walletAddresses }
                          sliderWidth={ Dimensions.get('window').width }
                          itemWidth={ Dimensions.get('window').width }
                          renderItem={ renderTittle }
                          onSnapToItem={ index => {
                            view.activeIndex = index
                            carouselBodyRef.current.snapToItem(index)
                          } }
                      />
                  </View>
                  <WalletTabs index={ view.activeIndex }/>
                  <WalletTransactionControls/>
                  <Carousel
                      vertical={ false }
                      scrollEnabled={ false }
                      enableSnap={ false }
                      inactiveSlideScale={ 1 }
                      layoutCardOffset={ 0 }
                      layout={ "default" }
                      ref={ carouselBodyRef }
                      data={ view.walletAddresses }
                      sliderWidth={ Dimensions.get('window').width }
                      itemWidth={ Dimensions.get('window').width }
                      renderItem={ renderBody }
                  />
              </View>
          </> }
        </>
      </Screen> }
      after={ <View>
        <WalletMenuDialog/>
        <SelfAddressQrCodeDialog/>
      </View> }
      isBlurActive={ (walletMenu.display ||
          sendTransactionDialog.display ||
          selfAddressQrCodeDialogViewModel.display) }
  />
})

export const WalletsScreen = provider()(Wallets)