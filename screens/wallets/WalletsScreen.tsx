import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Button, Colors, LoaderScreen, View } from "react-native-ui-lib";
import { provider, useInstance } from "react-ioc";
import { WalletsScreenModel } from "./WalletsScreenModel";

import { Screen } from "../../components";
import Carousel from 'react-native-snap-carousel';
import { Dimensions } from "react-native";
import { t } from "../../i18n";
import { WalletTittle } from "./wallet/WalletTittle";
import { WalletBody } from "./wallet/WalletBody";
import { WalletTransactionControls } from "./wallet/WalletTransactionControls";
import {
    SelfAddressQrCodeDialogViewModel
} from "../../components/dialogs/selfAddressQrCodeDialog/SelfAddressQrCodeDialogViewModel";
import { SelfAddressQrCodeDialog } from "../../components/dialogs/selfAddressQrCodeDialog/SelfAddressQrCodeDialog";
import { BlurWrapper } from "../../components/blurWrapper/BlurWrapper"
import { useNavigation } from "@react-navigation/native";
import { getWalletStore } from "../../App";
import { TOAST_POSITION } from "../../components/toasts/appToast/AppToast";

const renderTittle = ({ item }) => <WalletTittle { ...item } />
const renderBody = ({ item }) => <WalletBody { ...item } />

const Wallets = observer<{ route: any }>(function ({ route }) {

    const view = useInstance(WalletsScreenModel)
    const nav = useNavigation<any>()
    const selfAddressQrCodeDialogViewModel = useInstance(SelfAddressQrCodeDialogViewModel)

    const carouselTittleRef = useRef<Carousel<any>>()
    const carouselBodyRef = useRef<Carousel<any>>()

    useEffect(() => {
        view.init(route.params?.force)
        nav.addListener('focus', async () => {
            if (!carouselBodyRef.current) return
            if (carouselBodyRef?.current.currentIndex !== getWalletStore().selectedWalletIndex) {
                carouselTittleRef?.current.snapToItem(getWalletStore().selectedWalletIndex)
            }
        })
    }, [])

    useEffect(() => {
        if (route.params?.index) {
            carouselTittleRef.current.snapToItem(+route.params.index)
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
                    <View paddingT-20 paddingL-16 left>
                        <Button testID={ 'allAddressesOrCreateWalletBtn' } link textM primary
                                label={ getWalletStore().wallets.length > 1 ? t('walletScreen.allAddresses') : t("walletScreen.menuDialog.createWallet.name") }
                                onPress={ () => getWalletStore().wallets.length > 1 ? nav.navigate("walletsList", { animate: true }) : view.createWalletDialog(TOAST_POSITION.UNDER_TAB_BAR) }
                        />
                    </View>
                    <View paddingB-10>
                        <View height={ 100 } testID={ 'titleWalletBlock' }>
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
                                    getWalletStore().setSelectedWalletIndex(index)
                                    carouselBodyRef.current.snapToItem(index)
                                } }
                            />
                        </View>
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
                {
                    !view.allInitialized && <LoaderScreen/>
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