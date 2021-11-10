import React, { useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"
import { RefreshControl, ScrollView } from "react-native"
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
import { TransactionItem } from "../../../components/transactionItem/TransactionItem";
import { RootNavigation } from "../../../navigators";

const TransactionsList = observer<{ route: any }>(({ route }) => {
  const view = useInstance(TransactionsListScreenViewModel)
  const nav = useNavigation()
  const scrollRef = useRef()

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
  };

  useEffect(() => {
    view.init(route.params)
  }, [])

  const renderItem = ({ item, index }) => <TransactionItem key={ item.hash + item.receiptStatus } item={ item }
                                                           index={ index } onPress={
    () => {
      RootNavigation.navigate("walletTransaction", {
        wallet: route.params.wallet,
        tokenAddress: view.token.tokenAddress,
        transactionKey: item.key
      })
    }
  }/>

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
              <ScrollView
                  refreshControl={
                    <RefreshControl
                        refreshing={ view.refreshing }
                        onRefresh={ async () => {
                          view.refreshing = true
                          if (!view.tokenAddress) {
                            await view.wallet.loadTransactions(true)
                          } else {
                            await view.wallet.getERC20Transactions(true)
                          }
                          view.refreshing = false
                        } }
                    />
                  }
                  ref={ scrollRef }
                  onScroll={ ({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                      if (!view.tokenAddress) {
                        view.wallet.loadTransactions();
                        // @ts-ignore
                         scrollRef?.current.scrollToEnd()
                      }
                    }

                  } }
                  scrollEventThrottle={ 400 }
              >
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
                      <WalletTransactionControls tokenAddress={ view.tokenAddress }/>
                  </View>
                  <View padding-16>
                      <Text textM>{ t("walletMenuDialog.transactionHistory") }</Text>
                  </View>
                  <Card marginH-16 paddingV-8>
                    { view.refreshing && <View center padding-15>
                        <Text textM textGrey>{ `${ t("common.refresh") }...` }</Text>
                    </View> }
                    {
                      !!view.transactions && !!view.transactions.length && <>
                        { view.transactions.map((item, index) => renderItem({
                          item,
                          index
                        }))
                        }
                        {
                          view.loadingTransactions && <View padding-15><LoaderScreen/></View>
                        }
                      </>
                    }
                    {
                      !view.refreshing && (!view.transactions || view.transactions.length === 0) &&
                      <View absB center padding-20><Text>{ t("common.noData") }</Text></View>
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
