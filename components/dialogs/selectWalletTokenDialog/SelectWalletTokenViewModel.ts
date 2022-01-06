import { makeAutoObservable } from "mobx";
import { getWalletStore } from "../../../App";
import { beautifyNumber } from "../../../utils/number";

export class SelectWalletTokenViewModel {
  display = false
  walletAddress = ""
  tokenAddress = ""

  init(walletAddress) {
    this.walletAddress = walletAddress
  }

  get wallet() {
    return getWalletStore().allWallets.find(w => w.address === this.walletAddress)
  }

  get options() {
    const options = [
      {
        name: "Ethereum",
        symbol: "ETH",
        tokenAddress: "",
        logo: "ethereum",
        formatFiatBalance: beautifyNumber(this.wallet?.formatFiatBalance),
        formatBalance: this.wallet?.formatBalance,
        onPress: () => {
          this.tokenAddress = "ETH"
          this.display = false
        }
      }
    ]

    this.wallet?.erc20List && options.push(...this.wallet.erc20List.map(i => ({
      name: i.name,
      symbol: i.symbol,
      tokenAddress: i.tokenAddress,
      logo: i.logo,
      formatBalance: i.formatBalance,
      formatFiatBalance: i.formatFiatBalance,
      onPress: () => {
        this.tokenAddress = i.tokenAddress || "ETH"
        this.display = false
      },
    })))

    return options
  }

  constructor() {
    makeAutoObservable(this, null, { autoBind: true })
  }
}