import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Button, Card, Colors, LoaderScreen, Text, View } from "react-native-ui-lib";
import { provider, useInstance } from "react-ioc";
import { TransactionScreenViewModel } from "./TransactionScreenViewModel";
import { Screen } from "../../../components";
import { t } from "../../../i18n";
import { renderShortAddress } from "../../../utils/address";
import { Linking } from "react-native";
import { getEthereumProvider, getWalletStore } from "../../../App";
import { TRANSACTION_STATUS } from "../../../store/wallet/transaction/EthereumTransaction";
import { Header, ICON_HEADER } from "../../../components/header/Header";
import { currencyFormat } from "../../../utils/number";

const Transaction = observer<{ route: any }>(({ route }) => {
  const view = useInstance(TransactionScreenViewModel)


  useEffect(() => {
    view.init(route.params)
  }, [])

  return <Screen
      backgroundColor={ Colors.bg }
      statusBarBg={ Colors.bg }
      preset="fixed"
  >
    <Header icon={ ICON_HEADER.CROSS }/>
    {
      view.initialized && !view.transaction && <View flex centerH padding-40>
          <Text>Transaction was not found</Text>
      </View>
    }
    {
      view.initialized && view.transaction && <View flex>
          <View row spread padding-16>
              <Text text16 robotoM>{
                t("transactionScreen.transactionDetails")
              }</Text>
              <Button onPress={ async () => {
                const baseUrl = getEthereumProvider().currentNetwork.type === "mainnet" ? "https://etherscan.io/tx/" : `https://${ getEthereumProvider().currentNetwork.type }.etherscan.io/tx/`
                const url = baseUrl + view.transaction.hash
                await Linking.openURL(url)
              }
              } robotoM link text14 label={ t("transactionScreen.viewOnEtherScan") }/>
          </View>
          <View padding-16>
              <Card>
                  <View row spread margin-16>
                      <Text text-grey>
                        { t("transactionScreen.status") }
                      </Text>
                      <Text black text16 robotoR>{ view.transaction.actionName }</Text>
                  </View>
                  <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 15 } }/>
                  <View>
                      <View row spread margin-16>
                          <Text text-grey>
                            { t("transactionScreen.date") }
                          </Text>
                          <Text black robotoR robotoM>{ view.transaction.formatDate }</Text>
                      </View>
                  </View>
                  <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 15 } }/>
                  <View>
                      <View row spread margin-16>
                          <Text text-grey>
                            { t("transactionScreen.from") }
                          </Text>
                          <Text text16 robotoR black>{ renderShortAddress(view.transaction.fromAddress) }</Text>

                      </View>
                  </View>
                  <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 15 } }/>
                  <View>
                      <View row spread margin-16>
                          <Text text-grey>
                            { t("transactionScreen.to") }
                          </Text>
                          <Text black text16 robotoR>{ renderShortAddress(view.transaction.toAddress) }</Text>

                      </View>
                  </View>
              </Card>
          </View>
          <View padding-16>
              <Card>
                  <View row spread margin-16 centerV>
                      <Text black text16 robotoM>
                        { t("transactionScreen.amount") }
                      </Text>
                      <View right>
                          <Text black text16 robotoM>{ view.transaction.formatFiatValue }</Text>
                          <Text text-grey
                                robotoR text14>{ `${ view.transaction.formatValue } ${ view.transaction.symbol || 'ETH' }` }</Text>
                      </View>

                  </View>
                { !!view.transaction?.fiatFee && <View>
                    <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 15 } }/>
                    <View row spread margin-16 centerV>
                        <Text black text16 robotoM>
                          { t("transactionScreen.suggestedFee") }
                        </Text>
                        <View right>
                            <Text black text16 robotoM>{ currencyFormat(view.transaction.fiatFee, getWalletStore().currentFiatCurrency) }</Text>
                            <Text text-grey
                                  robotoR text14>{ `${ view.transaction.formatFee } ${ view.transaction.symbol || 'ETH' }` }</Text>
                        </View>
                    </View>
                </View>
                }
                { !!view.transaction?.fiatTotal && <View>
                    <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 15 } }/>
                    <View row spread margin-16 centerV>
                        <Text black text16 robotoM>
                          { t("transactionScreen.total") }
                        </Text>
                        <View right>
                            <Text black text16 robotoM>{ currencyFormat(view.transaction.fiatTotal, getWalletStore().currentFiatCurrency) }</Text>
                            <Text text-grey
                                  robotoR text14>{ `${ view.transaction.formatTotal } ${ view.transaction.symbol || 'ETH' }` }</Text>
                        </View>
                    </View>
                </View>
                }
              </Card>
          </View>
        { view.transaction.receiptStatus === TRANSACTION_STATUS.PENDING &&
        <View flex bottom padding-20>
            <Button disabled={ !view.transaction.canRewriteTransaction } onPress={ view.transaction.cancelTx }
                    paddingB-20 link
                    label={ t("transactionScreen.cancelTransaction") }/>
            <Button disabled={ !view.transaction.canRewriteTransaction } onPress={ view.transaction.speedUpTx }
                    br50
                    label={ t("transactionScreen.speedUpTransaction") }/>
        </View>
        }
      </View>
    }
    {
      !view.initialized && <View flex><LoaderScreen/></View>
    }

  </Screen>
})

export const TransactionScreen = provider()(Transaction)
TransactionScreen.register(TransactionScreenViewModel)