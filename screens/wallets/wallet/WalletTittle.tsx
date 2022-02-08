import { Button, Colors, LoaderScreen, Text, TouchableOpacity, View } from "react-native-ui-lib";
import React from "react";
import { observer } from "mobx-react-lite";
import { getAppStore, getWalletStore } from "../../../App";
import { Wallet } from "../../../store/wallet/Wallet";
import { t } from "../../../i18n";
import { runUnprotected } from "mobx-keystone";
import { TOASTER_TYPE } from "../../../store/app/AppStore";
import Clipboard from "@react-native-clipboard/clipboard";

export const WalletTittle = observer<any>(({ address }) => {
    const wallet: Wallet = getWalletStore().allWallets.find((w: Wallet) => w.address === address)
    return (
        <View padding-20>
            {
                !!wallet.initialized && <View row spread centerV>
                    <TouchableOpacity testID={ `changeCurrentFiatCurrency-${ address }` }
                                      onPress={ getWalletStore().changeCurrentFiatCurrency }>
                        <Text h2 black>{ wallet.formatTotalWalletFiatBalance }</Text>
                        <Text text-grey>{ t("walletScreen.totalBalanceTittle") }</Text>
                    </TouchableOpacity>
                    <View>
                        <Button testID={ `copyWalletAddress-${ address }` } onPress={ () => {
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
                        } } style={ { backgroundColor: Colors.rgba(Colors.primary, 0.1), borderRadius: 12 } } textM primary
                                label={ wallet.formatAddress }/>
                    </View>
                </View>
            }
            {
                !wallet.initialized && <LoaderScreen/>
            }
        </View>
    )
})