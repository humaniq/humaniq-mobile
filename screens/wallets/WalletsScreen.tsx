import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Button, Colors, View } from "react-native-ui-lib";
import { provider, useInstance } from "react-ioc";
import { WalletsScreenModel } from "./WalletsScreenModel";

import { Screen } from "../../components";
import Carousel from 'react-native-snap-carousel';
import { Dimensions, InteractionManager } from "react-native";
import { t } from "../../i18n";
import { WalletTittle } from "./wallet/WalletTittle";
import { WalletBody } from "./wallet/WalletBody";
import {
    SelfAddressQrCodeDialogViewModel
} from "../../components/dialogs/selfAddressQrCodeDialog/SelfAddressQrCodeDialogViewModel";
import { SelfAddressQrCodeDialog } from "../../components/dialogs/selfAddressQrCodeDialog/SelfAddressQrCodeDialog";
import { BlurWrapper } from "../../components/blurWrapper/BlurWrapper"
import { useNavigation } from "@react-navigation/native";
import { getBannerStore, getWalletConnectStore, getWalletStore } from "../../App";
import { TOAST_POSITION } from "../../components/toasts/appToast/AppToast";
import { WalletListScreenSkeleton } from "../../components/skeleton/templates/SkeletonTemplates";
import { HIcon } from "../../components/icon";
import { RootNavigation } from "../../navigators";
import { Banners } from "../../components/banner/Banner";

const renderTittle = ({ item }) => <WalletTittle { ...item } />
const renderBody = ({ item }) => <WalletBody { ...item } />

const Wallets = observer<{ route: any }>(function ({ route }) {

    const view = useInstance(WalletsScreenModel)
    const nav = useNavigation<any>()
    const selfAddressQrCodeDialogViewModel = useInstance(SelfAddressQrCodeDialogViewModel)

    const carouselTittleRef = useRef<Carousel<any>>()
    const carouselBodyRef = useRef<Carousel<any>>()

    useEffect(() => {
        InteractionManager.runAfterInteractions(async () => {
            view.init(route.params?.force)
        })
        nav.addListener('focus', async () => {
            if (!carouselBodyRef.current) return
            if (carouselBodyRef?.current.currentIndex !== getWalletStore().selectedWalletIndex) {
                carouselTittleRef?.current?.snapToItem(getWalletStore().selectedWalletIndex)
            }
        })
    }, [])

    useEffect(() => {
        if (route.params?.index) {
            carouselTittleRef?.current?.snapToItem(+route.params.index)
        }
    }, [ route ])

    return <BlurWrapper
        before={ <Screen
            testID={ 'wallets-screen' }
            backgroundColor={ Colors.bg } statusBarBg={ Colors.bg }
            preset="scroll"
            refreshing={ view.refreshing }
            onRefresh={ view.onRefresh }
            style={ !view.allInitialized ? { height: "100%" } : {} }
        >
            <>
                { view.allInitialized && <>
                    <View paddingT-20 paddingH-16 left row centerV spread>
                        <Button testID={ 'allAddressesOrCreateWalletBtn' } link textM primary
                                label={ getWalletStore().wallets.length > 1 ? t('walletScreen.allAddresses') : t("walletScreen.menuDialog.createWallet.name") }
                                onPress={ () => getWalletStore().wallets.length > 1 ? nav.navigate("walletsList", { animate: true }) : view.createWalletDialog(TOAST_POSITION.UNDER_TAB_BAR) }
                        />
                        <View row right centerV>
                            <HIcon size={ 22 } color={ Colors.textBlack } name={ "preferences" }
                                   style={ { marginRight: 30 } } onPress={ () => nav.navigate("visibility") }/>
                            <HIcon size={ 22 } color={ Colors.textBlack } name="camera" style={ { marginRight: 10 } }
                                   onPress={ () => {
                                       nav.navigate("QRScanner", {
                                           // @ts-ignore
                                           onScanSuccess: meta => {
                                               if (meta.action === "send-eth" && meta.target_address) {
                                                   RootNavigation.navigate("sendTransaction", {
                                                       screen: "selectAddress",
                                                       params: {
                                                           walletAddress: view.currentWallet.address,
                                                           to: meta.target_address
                                                       }
                                                   })
                                               } else if (meta.action === "wallet-connect") {
                                                   console.log({ meta })
                                                   getWalletConnectStore().newSession(meta.walletConnectURI)
                                               }
                                           }
                                       }, undefined, undefined)
                                   } }/>
                        </View>
                    </View>
                    <View paddingB-10>
                        <View testID={ 'titleWalletBlock' }>
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
                                    // @ts-ignore
                                    getWalletStore().setSelectedWalletIndex(index)
                                    carouselBodyRef.current.snapToItem(index)
                                } }
                            />
                        </View>
                        <View row flex>
                            <Banners banners={ getBannerStore().banners }/>
                        </View>
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
                {
                    !view.allInitialized && <WalletListScreenSkeleton/>
                }
            </>
        </Screen> }
        after={ <View>
            <SelfAddressQrCodeDialog/>
        </View> }
        isBlurActive={
            selfAddressQrCodeDialogViewModel.display }
    />
})

export const WalletsScreen = provider()(Wallets)