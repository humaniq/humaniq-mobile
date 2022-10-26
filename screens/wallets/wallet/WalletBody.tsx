import { Card } from "react-native-ui-lib";
import React from "react";
import { observer } from "mobx-react-lite";
import { getDictionary, getEVMProvider, getWalletStore } from "../../../App";
import { Wallet } from "../../../store/wallet/Wallet";
import { TokenItem } from "../../../components/tokenItem/TokenItem";
import { RootNavigation } from "../../../navigators";
import { capitalize } from "../../../utils/general";
import { ListSkeleton } from "../../../components/skeleton/templates/SkeletonTemplates";

export const WalletBody = observer<any>(({ address }) => {

    const wallet: Wallet = getWalletStore().allWallets.find((w: Wallet) => w.address === address)
    return (
        <Card marginH-16 marginB-10>
            {
                !!wallet.initialized && getDictionary().networkTokensInitialized && !wallet.pendingGetTokenBalances && !wallet.pending && <>
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
                        formatBalance={ `${ wallet.formatBalance } ${ getEVMProvider().currentNetwork.nativeSymbol.toUpperCase() }` }
                        formatFiatBalance={ wallet.formatFiatBalance }
                        index={ 0 }
                        fiatOnTop={ getWalletStore().fiatOnTop }
                    />
                    {
                        wallet.tokenList.length > 0 && wallet.tokenList
                            .filter(t => getDictionary().currentTokenDictionary[t.tokenAddress] ? !getDictionary().currentTokenDictionary[t.tokenAddress]?.hidden : false)
                            .map((p, i) => {
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
                (!getDictionary().networkTokensInitialized || wallet.pendingGetTokenBalances || wallet.pending) && <ListSkeleton/>
            }
        </Card>
    )
})