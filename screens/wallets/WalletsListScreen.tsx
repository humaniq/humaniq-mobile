import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Avatar, Button, Card, Colors, LoaderScreen, Text, View } from "react-native-ui-lib";
import { provider, useInstance } from "react-ioc";
import { WalletsScreenModel } from "./WalletsScreenModel";
import { BlurWrapper } from "../../components/blurWrapper/BlurWrapper"
import { Screen } from "../../components";
import { t } from "../../i18n";
import { getWalletStore } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { Wallet } from "../../store/wallet/Wallet";
import Ripple from "react-native-material-ripple";
import { Header } from "../../components/header/Header";
import { HIcon } from "../../components/icon";

const WalletsList = observer<{ route: any }>(({ route }) => {
  const view = useInstance(WalletsScreenModel)
  const store = getWalletStore()
  const nav = useNavigation()

  useEffect(() => {
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
            <View flex>
                <Header title={ t('walletScreen.allAddresses') }/>
                <View padding-16>
                    <View row spread centerV>
                        <View>
                            <Text h2 black>{ store.formatTotalAllWalletsFiatBalance }</Text>
                            <Text text-grey>{ t("walletScreen.totalBalanceTittle") }</Text>
                        </View>
                    </View>
                </View>
                <View padding-16>
                    <Card>
                      {
                        view.allWallets && view.allWallets.map((w: Wallet, i) => {
                          return <Ripple key={ w.address } rippleColor={ Colors.primary }
                                         onPress={ () => nav.navigate("mainStack", {
                                           screen: "wallet",
                                           params: {
                                             screen: "wallet-main",
                                             params: {
                                               index: `${ i }`
                                             }
                                           }
                                         }) }
                          >
                            <View padding-10 paddingH-15 paddingR-20>
                              <View row centerV>
                                <View flex-2>
                                  {
                                    <Avatar size={ 44 } backgroundColor={ Colors.greyLight }>
                                      <HIcon name={"wallet"} size={ 20 } style={ { color: Colors.primary } }/>
                                    </Avatar>
                                  }
                                </View>
                                <View flex-6>
                                  <Text numberOfLines={ 1 } textM text16 black>{ w.formatAddress }</Text>
                                </View>
                                <View flex-3 right>
                                  <Text numberOfLines={ 1 } text16 robotoB black>
                                    { w.formatTotalWalletFiatBalance }
                                  </Text>
                                </View>
                              </View>
                              { i !== 0 && <View absR style={ {
                                borderWidth: 1,
                                borderColor: Colors.grey,
                                width: "90%",
                                borderBottomColor: "transparent"
                              } }/> }
                            </View></Ripple>
                        })
                      }
                    </Card>
                </View>
            </View>
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




