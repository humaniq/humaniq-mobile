import { Card, LoaderScreen } from "react-native-ui-lib";
import React from "react";
import { observer } from "mobx-react-lite";
import { getWalletStore } from "../../../App";
import { Wallet } from "../../../store/wallet/Wallet";
import { beautifyNumber } from "../../../utils/number";
import { TokenItem } from "../../../components/tokenItem/TokenItem";
import { RootNavigation } from "../../../navigators";

export const WalletBody = observer<any>(({ address }) => {
  // const store = useInstance(RootStore)
  // const wallet = store.walletStore.allWallets.find(w => w.address === address)
  const wallet: Wallet = getWalletStore().allWallets.find((w: Wallet) => w.address === address)
  return (
      <Card marginH-16>
        {
          !!wallet.initialized && <>
              <TokenItem
                  onPress={ () => RootNavigation.navigate("mainStack", {
                    screen: "wallet",
                    params: {
                      screen: "wallet-eth-transactions",
                      params: {
                        wallet: wallet.address,
                        symbol: 'ETH'
                      }
                    }
                  }) }
                  symbol={ "ETH" }
                  tokenAddress={ wallet.address }
                  logo={ "ethereum" }
                  name={ "Ethereum" }
                  formatBalance={ beautifyNumber(+wallet.formatBalance) }
                  formatFiatBalance={ wallet.formatFiatBalance }
                  index={ 0 }
              />
            {
              wallet.erc20List.length > 0 && wallet.erc20List.map((p, i) => {
                return <TokenItem key={ p.tokenAddress } tokenAddress={ p.tokenAddress } symbol={ p.symbol }
                                  formatBalance={ p.formatBalance } formatFiatBalance={ p.formatFiatBalance }
                                  logo={ p.logo } name={ p.name } index={ i + 1 }
                                  onPress={
                                    () => RootNavigation.navigate("mainStack", {
                                      screen: "wallet",
                                      params: {
                                        screen: "wallet-eth-transactions",
                                        params: {
                                          wallet: wallet.address,
                                          symbol: p.symbol,
                                          tokenAddress: p.tokenAddress
                                        }
                                      }
                                    })
                                  }
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