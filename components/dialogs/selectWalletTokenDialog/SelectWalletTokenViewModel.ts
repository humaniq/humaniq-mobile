import { makeAutoObservable } from "mobx";
import { getEVMProvider, getWalletStore } from "../../../App";
import { beautifyNumber } from "../../../utils/number";
import { Wallet } from "../../../store/wallet/Wallet";
import { capitalize } from "../../../utils/general";

export class SelectWalletTokenViewModel {
  display = false
  walletAddress = ""
  tokenAddress = ""

  init(walletAddress) {
    this.walletAddress = walletAddress
  }

  get wallet(): Wallet {
    return getWalletStore().allWallets.find(w => w.address === this.walletAddress)
  }

  get options() {
    const options = [
      {
        name: capitalize(getEVMProvider().currentNetwork.nativeCoin),
        symbol: getEVMProvider().currentNetwork.nativeSymbol.toUpperCase(),
        tokenAddress: "",
        logo: getEVMProvider().currentNetwork.nativeCoin,
        formatFiatBalance: beautifyNumber(this.wallet?.formatFiatBalance),
        formatBalance: this.wallet?.formatBalance,
        onPress: () => {
          console.log(getEVMProvider().currentNetwork.nativeSymbol.toUpperCase())
          this.tokenAddress = getEVMProvider().currentNetwork.nativeSymbol.toUpperCase()
          this.display = false
        }
      }
    ]

    this.wallet?.tokenList && options.push(...this.wallet.tokenList.map(i => ({
      name: i.name,
      symbol: i.symbol,
      tokenAddress: i.tokenAddress,
      logo: i.logo,
      formatBalance: i.formatBalance,
      formatFiatBalance: i.formatFiatBalance,
      onPress: () => {
        this.tokenAddress = i.tokenAddress || getEVMProvider().currentNetwork.nativeSymbol.toUpperCase()
        this.display = false
      },
    })))

    return options
  }

  constructor() {
    makeAutoObservable(this, null, { autoBind: true })
  }
}