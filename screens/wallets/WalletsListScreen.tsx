import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Button, Colors, LoaderScreen, View } from "react-native-ui-lib";
import { provider, useInstance } from "react-ioc";
import { WalletsScreenModel } from "./WalletsScreenModel";
import { BlurWrapper } from "../../components/blurWrapper/BlurWrapper"
import { Screen } from "../../components";
import { t } from "../../i18n";
import { getWalletStore } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { SelectWallet } from "../../components/selectWallet/SelectWallet";

const WalletsList = observer<{ route: any }>(({ route }) => {
  const view = useInstance(WalletsScreenModel)
  const nav = useNavigation()

  useEffect(() => {
    console.log(route)
    view.init()
  }, [])

  return <BlurWrapper
      before={
        <><Screen
            backgroundColor={ Colors.bg } statusBarBg={ Colors.bg }
            preset="scroll"
            refreshing={ view.refreshing }
            onRefresh={ view.onRefresh }
            style={ { minHeight: "100%" } }
        >
          {
              view.initialized &&
              <SelectWallet onPressWallet={
                (_, i) => {
                  if (route?.params?.goBack) {
                    view.activeIndex = i
                    getWalletStore().setSelectedWalletIndex(i)
                    nav.goBack()
                  } else {
                    nav.navigate("mainStack", {
                      screen: "wallet",
                      params: {
                        screen: "wallet-main",
                        params: {
                          index: `${ i }`
                        }
                      }
                    }, null, null)
                  }
                } }
                  wallets={ view.allWallets }
                  totalBalance={ getWalletStore().formatTotalAllWalletsFiatBalance }/>
          }
          { !view.initialized && <LoaderScreen/> }
          <Button margin-16 absB br40 label={ t("walletScreen.menuDialog.createWallet.name") }
                  onPress={ view.createWalletDialog }
          />
        </Screen>
        </> }
      after={ <View/> }
      isBlurActive={ false }
  />

})

export const WalletsListScreen = provider()(WalletsList)




