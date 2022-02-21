import React, { useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"
import { RefreshControl, ScrollView } from "react-native"
import { Avatar as Av, Card, Colors, LoaderScreen, Text, View } from "react-native-ui-lib"
import { provider, useInstance } from "react-ioc"
import { TransactionsListScreenViewModel } from "./TransactionsListScreenViewModel"
import { BlurWrapper } from "../../../components/blurWrapper/BlurWrapper"
import { Screen } from "../../../components"
import { WalletTransactionControls } from "../../wallets/wallet/WalletTransactionControls";
import { getDictionary } from "../../../App";
import { Avatar } from "../../../components/avatar/Avatar";
import { t } from "../../../i18n";
import { TransactionItem } from "../../../components/transactionItem/TransactionItem";
import { RootNavigation } from "../../../navigators";
import SearchPicture from "../../../assets/images/search.svg"
import { Header } from "../../../components/header/Header";
import { NATIVE_COIN } from "../../../config/network";
import { SkeletonTemplate, SkeletonView } from "../../../components/skeleton/Skeleton";

const TransactionsList = observer<{ route: any }>(({ route }) => {
    const view = useInstance(TransactionsListScreenViewModel)
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
                <Header title={ view.token.name }/>
                { view.initialized &&
                    <>
                        <ScrollView
                            testID={ 'transactionsListScreen' }
                            refreshControl={
                                <RefreshControl
                                    refreshing={ view.refreshing }
                                    onRefresh={ async () => {
                                        view.refreshing = true
                                        if (!view.tokenAddress) {
                                            await view.wallet.loadTransactions(true)
                                        } else {
                                            await view.wallet.getTokenTransactions(true)
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
                                <View row center paddingT-10>
                                    {
                                        view.token.logo === NATIVE_COIN.ETHEREUM &&
                                        <Av size={ 80 } source={ require("../../../assets/images/ethereum-logo.png") }/>
                                    }
                                    {
                                        view.token.logo === NATIVE_COIN.BINANCECOIN &&
                                        <Av size={ 80 } source={ require("../../../assets/images/binancecoin-logo.png") }/>
                                    }
                                    {
                                        !view.token.logo &&
                                        <Avatar address={ view.token.tokenAddress } size={ 80 }
                                                source={ { uri: getDictionary().ethToken.get(view.token.symbol)?.logoURI } }/>
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
                            { view.refreshing && <SkeletonView isLoading={ view.refreshing }
                                                                type={ SkeletonTemplate.TRANSACTION_LIST }/> }
                            {
                                !!view.transactions && !!view.transactions.length && <Card marginH-16 paddingV-8>
                                    { view.transactions.map((item, index) => renderItem({
                                        item,
                                        index
                                    }))
                                    }
                                    {
                                        view.loadingTransactions && <View padding-15><LoaderScreen/></View>
                                    }
                                </Card>
                            }
                            {
                                !view.refreshing && (!view.transactions || view.transactions.length === 0) &&
                                <View center padding-20>
                                    <SearchPicture width={ 200 } height={ 200 }/>
                                    <Text robotoR textGrey text16>{ t("walletMenuDialog.noTransactions") }</Text>
                                </View>
                            }
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