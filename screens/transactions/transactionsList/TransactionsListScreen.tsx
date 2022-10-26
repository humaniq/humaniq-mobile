import React, { useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"
import { Linking, RefreshControl, ScrollView } from "react-native"
import { Avatar as Av, Button, Card, Colors, LoaderScreen, Text, View } from "react-native-ui-lib"
import { provider, useInstance } from "react-ioc"
import { TransactionsListScreenViewModel } from "./TransactionsListScreenViewModel"
import { BlurWrapper } from "../../../components/blurWrapper/BlurWrapper"
import { Screen } from "../../../components"
import { WalletTransactionControls } from "../../wallets/wallet/WalletTransactionControls";
import { getDictionary, getEVMProvider, getWalletStore } from "../../../App";
import { Avatar } from "../../../components/avatar/Avatar";
import { t } from "../../../i18n";
import { TransactionItem } from "../../../components/transactionItem/TransactionItem";
import { RootNavigation } from "../../../navigators";
import SearchPicture from "../../../assets/images/search.svg"
import { Header } from "../../../components/header/Header";
import { EVM_NETWORKS_NAMES, NATIVE_COIN, NATIVE_COIN_SYMBOL } from "../../../config/network";
import { ListSkeleton, TransactionListScreenSkeleton } from "../../../components/skeleton/templates/SkeletonTemplates";
import { CryptoCard } from "../../../components/card/CryptoCard";

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
                { view.initialized && <ScrollView
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
                                // scrollRef.current.scrollTo({y: scrollRef.current.height - 20 })
                            }
                        }
                    } }
                    scrollEventThrottle={ 50 }
                >
                    <CryptoCard>
                        <View marginV-16 marginH-16>
                            <View row center>
                                {
                                    view.token?.logo === NATIVE_COIN.ETHEREUM &&
                                    <Av size={ 44 } containerStyle={ { position: 'relative' } }
                                        imageStyle={ { width: 36, height: 36, position: 'absolute', left: 4, top: 3 } }
                                        source={ require("../../../assets/images/ethereum-logo.png") }/>
                                }
                                {
                                    view.token?.logo === NATIVE_COIN.BINANCECOIN &&
                                    <Av size={ 44 } source={ require("../../../assets/images/binancecoin-logo.png") }/>
                                }
                                { view.token?.logo !== NATIVE_COIN.ETHEREUM && view.token.logo !== NATIVE_COIN.BINANCECOIN &&
                                    <Avatar address={ view.token.tokenAddress } size={ 44 }
                                            source={ { uri: getDictionary().token[getEVMProvider().currentNetwork.chainID][view.token.tokenAddress]?.logo } }/>
                                }
                            </View>
                            <Text white robotoM text24 center marginT-8>
                                { view.token.formatFiatBalance }
                            </Text>
                            <Text white robotoM text14 center marginT-4 marginB-16>
                                { `${ view.token.formatBalance }` }
                            </Text>
                            <WalletTransactionControls tokenAddress={ view.tokenAddress }/>
                        </View>
                    </CryptoCard>
                    <View row spread paddingH-16 paddingV-14>
                        <Text textM>{ t("walletMenuDialog.transactionHistory") }</Text>
                        <Button onPress={ async () => {
                            const baseUrl = getEVMProvider().currentNetwork.nativeSymbol === NATIVE_COIN_SYMBOL.BNB ?
                                getEVMProvider().currentNetwork.type === EVM_NETWORKS_NAMES.BSC ? "https://bscscan.com/address/" : `https://testnet.bscscan.com/address/`
                                : getEVMProvider().currentNetwork.type === EVM_NETWORKS_NAMES.MAINNET ? "https://etherscan.io/address/" : `https://${ getEVMProvider().currentNetwork.type }.etherscan.io/address/`
                            let url = baseUrl + getWalletStore().selectedWallet.address
                            if (view.tokenAddress) {
                                url += `?toaddress=${ view.tokenAddress }`
                            }
                            await Linking.openURL(url)
                        }
                        } robotoM link text14
                                label={ t("transactionScreen.viewOnEtherScan", { 0: getEVMProvider().currentNetwork.nativeSymbol === NATIVE_COIN_SYMBOL.BNB ? "BscScan" : "Etherscan" }) }/>
                    </View>
                    { view.refreshing && <ListSkeleton marginV={ 0 }/> }
                    {
                        !view.refreshing && !!view.transactions && !!view.transactions.length &&
                        <Card marginH-16 paddingV-8>
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
                </ScrollView> }
                { !view.initialized && <TransactionListScreenSkeleton/> }
            </Screen>
        }
        after={ <View absB flex row/> }
        isBlurActive={ false }
    />
})

export const TransactionsListScreen = provider()(TransactionsList)
TransactionsListScreen.register(TransactionsListScreenViewModel)