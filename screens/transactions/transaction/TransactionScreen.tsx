import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Button, Card, Colors, LoaderScreen, Text, View } from "react-native-ui-lib";
import { provider, useInstance } from "react-ioc";
import { TransactionScreenViewModel } from "./TransactionScreenViewModel";
import { Screen } from "../../../components";
import { t } from "../../../i18n";
import { renderShortAddress } from "../../../utils/address";
import { Linking } from "react-native";
import { getEVMProvider, getWalletStore } from "../../../App";
import { TRANSACTION_STATUS } from "../../../store/wallet/transaction/NativeTransaction";
import { Header, ICON_HEADER } from "../../../components/header/Header";
import { currencyFormat } from "../../../utils/number";
import { EVM_NETWORKS_NAMES, NATIVE_COIN_SYMBOL } from "../../../config/network";

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
            view.initialized && view.transaction && <View flex testID={ 'transactionScreen' }>
                <View row spread padding-16>
                    <Text text16 robotoM>{
                        t("transactionScreen.transactionDetails")
                    }</Text>
                    <Button onPress={ async () => {
                        const baseUrl = getEVMProvider().currentNetwork.nativeSymbol === NATIVE_COIN_SYMBOL.BNB ?
                            getEVMProvider().currentNetwork.type === EVM_NETWORKS_NAMES.BSC ? "https://bscscan.com/tx/" : `https://testnet.bscscan.com/tx/`
                            : getEVMProvider().currentNetwork.type === EVM_NETWORKS_NAMES.MAINNET ? "https://etherscan.io/tx/" : `https://${ getEVMProvider().currentNetwork.type }.etherscan.io/tx/`
                        const url = baseUrl + view.transaction.hash
                        await Linking.openURL(url)
                    }
                    } robotoM link text14 label={ t("transactionScreen.viewOnEtherScan", { 0: getEVMProvider().currentNetwork.nativeSymbol === NATIVE_COIN_SYMBOL.BNB ? "BscScan" : "Etherscan" } ) }/>
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
                                <Text black text16 robotoR>{ view.transaction.formatDate }</Text>
                            </View>
                        </View>
                        <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 15 } }/>
                        <View>
                            <View row spread margin-16>
                                <Text text-grey>
                                    { t("transactionScreen.from") }
                                </Text>
                                <Text black text16 robotoR>{ renderShortAddress(view.transaction.fromAddress) }</Text>
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
                        <View row spread marginH-16 centerV>
                            <Text black text16 robotoM>
                                { t("transactionScreen.amount") }
                            </Text>
                            <View right marginV-8>
                                <Text black text16 marginB-3 robotoM>{ view.transaction.formatFiatValue }</Text>
                                <Text text-grey marginT-3
                                      robotoR
                                      text14>{ `${ view.transaction.formatValue } ${ view.transaction.symbol || getEVMProvider().currentNetwork.nativeSymbol.toUpperCase() }` }</Text>
                            </View>
                        </View>
                        { !!view.transaction?.fiatFee && <View>
                            <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 15 } }/>
                            <View row spread marginH-16 centerV>
                                <Text black text16 robotoM>
                                    { t("transactionScreen.suggestedFee") }
                                </Text>
                                <View right marginV-8>
                                    <Text black text16 marginB-3
                                          robotoM>{ currencyFormat(view.transaction.fiatFee, getWalletStore().currentFiatCurrency) }</Text>
                                    <Text text-grey marginT-3
                                          robotoR
                                          text14>{ `${ view.transaction.formatFee } ${ view.transaction.symbol || getEVMProvider().currentNetwork.nativeSymbol.toUpperCase() }` }</Text>
                                </View>
                            </View>
                        </View>
                        }
                        { !!view.transaction?.fiatTotal && <View>
                            <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 15 } }/>
                            <View row spread marginH-16 centerV>
                                <Text black text16 robotoM>
                                    { t("transactionScreen.total") }
                                </Text>
                                <View right marginV-8>
                                    <Text black text16 marginB-3
                                          robotoM>{ currencyFormat(view.transaction.fiatTotal, getWalletStore().currentFiatCurrency) }</Text>
                                    <Text text-grey marginT-3
                                          robotoR
                                          text14>{ `${ view.transaction.formatTotal } ${ view.transaction.symbol || getEVMProvider().currentNetwork.nativeSymbol.toUpperCase() }` }</Text>
                                </View>
                            </View>
                        </View>
                        }
                    </Card>
                </View>
                { view.transaction.receiptStatus === TRANSACTION_STATUS.PENDING && getEVMProvider().currentNetwork.nativeSymbol !== NATIVE_COIN_SYMBOL.BNB &&
                    <View flex bottom padding-20>
                        <Button testID={ 'cancelTransaction' } disabled={ !view.transaction.canRewriteTransaction }
                                onPress={ view.transaction.cancelTx }
                                paddingB-20 link
                                label={ t("transactionScreen.cancelTransaction") }/>
                        <Button testID={ 'speedUpTransaction' } disabled={ !view.transaction.canRewriteTransaction }
                                onPress={ view.transaction.speedUpTx }
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
