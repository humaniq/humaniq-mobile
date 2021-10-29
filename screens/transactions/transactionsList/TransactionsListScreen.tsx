import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView } from "react-native"
import { Avatar as Av, Button, Card, Colors, LoaderScreen, Text, TouchableOpacity, View } from "react-native-ui-lib"
import { provider, useInstance } from "react-ioc"
import { TransactionsListScreenViewModel } from "./TransactionsListScreenViewModel"
import { BlurWrapper } from "../../../components/blurWrapper/BlurWrapper"
import { Screen } from "../../../components"
import ArrowLeft from "../../../assets/icons/arrow-left.svg";
import { useNavigation } from "@react-navigation/native";
import { WalletTransactionControls } from "../../wallets/wallet/WalletTransactionControls";
import { getDictionary } from "../../../App";
import { Avatar } from "../../../components/avatar/Avatar";
import { t } from "../../../i18n";
import Ripple from "react-native-material-ripple";
import { RootNavigation } from "../../../navigators";

const TransactionsList = observer<{ route: any }>(({ route }) => {
  const view = useInstance(TransactionsListScreenViewModel)
  const nav = useNavigation()

  useEffect(() => {
    view.init(route.params)
  }, [])

  return <BlurWrapper
      before={
        <Screen
            backgroundColor={ Colors.bg }
            statusBarBg={ Colors.bg }
            preset="fixed"

        >
          <TouchableOpacity padding-20 paddingL-16 left row centerV onPress={ nav.goBack }>
            <ArrowLeft height={ 16 } width={ 16 } style={ { color: Colors.primary } }/>
            <Button paddingL-30 link textM black text20 label={ view.token.name }
            />
          </TouchableOpacity>
          { view.initialized &&
          <>
              <ScrollView>
                  <View>
                      <View row center>
                        {
                          view.token.name === 'Ethereum' &&
                          <Av size={ 80 } source={ require("../../../assets/images/ethereum-logo.png") }/>
                        }
                        {
                          view.token.name !== 'Ethereum' &&
                          <Avatar address={ view.token.tokenAddress } size={ 80 }
                                  source={ { uri: view.token.logo || getDictionary().ethToken.get(view.token.symbol)?.logoURI } }/>
                        }
                      </View>
                      <View row center>
                          <Text h5>
                            { view.token.formatFiatBalance }
                          </Text>
                      </View>
                      <View row center>
                          <Text>
                            { `${ view.token.formatBalance } ${ view.token.symbol }` }
                          </Text>
                      </View>
                      <WalletTransactionControls/>
                  </View>
                  <View padding-16>
                      <Text textM>{ t("walletMenuDialog.transactionHistory") }</Text>
                  </View>
                  <Card marginH-16 paddingV-8>
                    {
                      !!view.transactions && !!view.transactions.length && view.transactions.map((i, index) => {
                        return <Ripple key={ i.nonce } rippleColor={ Colors.primary }
                                       onPress={ () => {
                                         RootNavigation.navigate("walletTransaction", {
                                           wallet: route.params.wallet,
                                           tokenAddress: view.token.tokenAddress,
                                           transactionKey: i.nonce
                                         })
                                       } }
                        >
                          <View backgroundColor={ Colors.white } key={ i.nonce }>
                            <View row spread padding-8 paddingH-16>
                              <View center flex-1>
                                <Av imageStyle={ { height: 24, width: 24, left: 10, top: 10, position: "absolute" } }
                                    containerStyle={ { position: "relative" } }
                                    size={ 44 } source={ i.statusIcon }/>
                              </View>
                              <View flex-5 paddingL-15>
                                <View>
                                  <Text text70 robotoM color={ i.actionColor }>{ i.actionName }</Text>
                                </View>
                                <View>
                                  <Text
                                      dark50>{ `${ i.blockTimestamp.toLocaleDateString() } ${ i.blockTimestamp.toLocaleTimeString() }` }</Text>
                                </View>
                              </View>
                              <View right centerV flex-4>
                                <View>
                                  <Text numberOfLines={ 1 } text70 dark30 robotoM
                                        color={ i.actionColor }>{ i.formatFiatValue }</Text>
                                </View>
                                <View>
                                  <Text dark50>
                                    { i.actionName }
                                  </Text>
                                </View>
                              </View>
                            </View>
                            { index !== 0 && <View absR style={ {
                              borderWidth: 1,
                              borderColor: Colors.grey,
                              width: "83%",
                              borderBottomColor: "transparent"
                            } }/> }
                          </View>
                        </Ripple>
                      })
                    }
                  </Card>
              </ScrollView>
          </>
          }
          { !view.initialized && <View flex><LoaderScreen/></View> }
        </Screen>
      }
      after={ <View absB flex row/> }
      isBlurActive={ false }
  />
})

export const TransactionsListScreen = provider()(TransactionsList)
TransactionsListScreen.register(TransactionsListScreenViewModel)
