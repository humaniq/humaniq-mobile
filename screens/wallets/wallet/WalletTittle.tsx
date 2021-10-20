import { Button, Colors, LoaderScreen, Text, View } from "react-native-ui-lib";
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
              <View>
                  <Text h2>{ wallet.formatTotalWalletFiatBalance }</Text>
                  <Text text-grey>{ t("walletScreen.totalBalanceTittle") }</Text>
              </View>
              <View>
                  <Button onPress={ () => {
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
                  } } style={ { backgroundColor: Colors.rgba(Colors.primary, 0.1) } } textM primary
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