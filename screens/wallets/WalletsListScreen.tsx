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
import ArrowLeft from '../../assets/icons/arrow-left.svg'
import { Wallet } from "../../store/wallet/Wallet";
import LogoWallet from '../../assets/icons/wallet.svg'
import Ripple from "react-native-material-ripple";

const WalletsList = observer(() => {
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
        >
          {
            view.initialized &&
            <View flex>
                <View paddingT-20 paddingL-16 left row centerV>
                    <ArrowLeft height={ 16 } width={ 16 } style={ { color: Colors.textBlack } }/>
                    <Button paddingL-30 link textM black text20 label={ t('walletScreen.allAddresses') }
                            onPress={ () => nav.goBack() }
                    />
                </View>
                <View padding-16>
                    <View row spread centerV>
                        <View>
                            <Text h2>{ store.formatTotalAllWalletsFiatBalance }</Text>
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
                                      <LogoWallet height={ 20 } width={ 20 } style={ { color: Colors.primary } }/>
                                    </Avatar>
                                  }
                                </View>
                                <View flex-6>
                                  <Text numberOfLines={ 1 } textM text16 grey20>{ w.formatAddress }</Text>
                                </View>
                                <View flex-3 right>
                                  <Text numberOfLines={ 1 } text16 robotoB grey20>
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
        </Screen>
          <Button margin-16 absB br40 label={ t("walletScreen.menuDialog.createWallet.name") }
                  onPress={ view.createWalletDialog }
          />
        </> }
      after={ <View/> }
      isBlurActive={ false }
  />

})

export const WalletsListScreen = provider()(WalletsList)




