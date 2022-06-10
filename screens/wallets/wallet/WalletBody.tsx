import { Card, LoaderScreen } from "react-native-ui-lib";
import React from "react";
import { observer } from "mobx-react-lite";
import { getEVMProvider, getWalletStore } from "../../../App";
import { Wallet } from "../../../store/wallet/Wallet";
import { beautifyNumber } from "../../../utils/number";
import { TokenItem } from "../../../components/tokenItem/TokenItem";
import { RootNavigation } from "../../../navigators";
import { capitalize } from "../../../utils/general";

export const WalletBody = observer<any>(({ address }) => {
    // const store = useInstance(RootStore)
    // const wallet = store.walletStore.allWallets.find(w => w.address === address)
    const wallet: Wallet = getWalletStore().allWallets.find((w: Wallet) => w.address === address)
    return (
        <Card marginH-16 marginB-10>
            {
                !!wallet.initialized && <>
                    <TokenItem
                        showGraph={ getWalletStore().showGraphBool }
                        onPress={ () => RootNavigation.navigate("walletTransactions", {
                            wallet: wallet.address,
                            symbol: getEVMProvider().currentNetwork.nativeSymbol.toUpperCase(),
                            animate: true
                        }) }
                        graphData={ getWalletStore().selectedWallet.graph }
                        symbol={ getEVMProvider().currentNetwork.nativeSymbol.toUpperCase() }
                        tokenAddress={ wallet.address }
                        logo={ getEVMProvider().currentNetwork.nativeCoin }
                        name={ capitalize(getEVMProvider().currentNetwork.nativeCoin) }
                        formatBalance={ `${ beautifyNumber(+wallet.formatBalance) } ${ getEVMProvider().currentNetwork.nativeSymbol.toUpperCase() }` }
                        formatFiatBalance={ wallet.formatFiatBalance }
                        index={ 0 }
                        fiatOnTop={ getWalletStore().fiatOnTop }
                    />
                    {
                        wallet.tokenList.length > 0 && wallet.tokenList.map((p, i) => {
                            return <TokenItem
                                showGraph={ getWalletStore().showGraphBool }
                                key={ p.tokenAddress } tokenAddress={ p.tokenAddress } symbol={ p.symbol }
                                graphData={ p.graph }
                                formatBalance={ p.formatBalance } formatFiatBalance={ p.formatFiatBalance }
                                logo={ p.logo } name={ p.name } index={ i + 1 }
                                onPress={
                                    () => RootNavigation.navigate("walletTransactions", {
                                        wallet: wallet.address,
                                        symbol: p.symbol,
                                        tokenAddress: p.tokenAddress,
                                        animate: true
                                    })
                                }
                                fiatOnTop={ getWalletStore().fiatOnTop }
                            />
                        })
                    }
                </>
            }
            {
                !wallet.initialized && <LoaderScreen/>
            }
        </Card>
    )
})