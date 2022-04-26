import { Avatar, Button, Colors, Text, TouchableOpacity, View } from "react-native-ui-lib";
import React from "react";
import { observer } from "mobx-react-lite";
import { getAppStore, getProfileStore, getWalletStore } from "../../../App";
import { Wallet } from "../../../store/wallet/Wallet";
import { t } from "../../../i18n";
import { runUnprotected } from "mobx-keystone";
import { TOASTER_TYPE } from "../../../store/app/AppStore";
import Clipboard from "@react-native-clipboard/clipboard";
import { WalletTransactionControls } from "./WalletTransactionControls";
import { CryptoCard } from "../../../components/card/CryptoCard";
import { HIcon } from "../../../components/icon";

export const WalletTittle = observer<any>(({ address }) => {
    const wallet: Wallet = getWalletStore().allWallets.find((w: Wallet) => w.address === address)

    if (!wallet.initialized) return null

    return <CryptoCard>
        <View marginT-16 marginB-16 marginH-16>
            <Button outline outlineColor={ Colors.white } testID={ `copyWalletAddress-${ address }` } onPress={ () => {
                Clipboard.setString(wallet.address)
                runUnprotected(() => {
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
            } } style={ {
                borderRadius: 14,
                alignSelf: "flex-end"
            } } labelStyle={ {
                letterSpacing: 0.5
            } }
                    iconSource={ () => {
                        return getProfileStore().verified && getWalletStore().allWallets[0].address === wallet.address ?
                            <Avatar backgroundColor={ Colors.white } size={ 16 }
                                    containerStyle={ { marginRight: 4 } }>
                                <HIcon name={ "done" } size={ 9 } color={ Colors.primary }/>
                            </Avatar> : false
                    } }
                    paddingT-5 paddingB-5 paddingL-12 paddingR-12 textM label={ wallet.formatAddress }/>
            <TouchableOpacity activeOpacity={ 0.8 } marginT-16 marginB-14
                              testID={ `changeCurrentFiatCurrency-${ address }` }
                              onPress={ getWalletStore().changeCurrentFiatCurrency }>
                <Text white text32 robotoB>{ wallet.formatTotalWalletFiatBalance }</Text>
                <Text white text14 robotoM>{ t("walletScreen.totalBalanceTittle") }</Text>
            </TouchableOpacity>
            <WalletTransactionControls/>
        </View>
    </CryptoCard>
})