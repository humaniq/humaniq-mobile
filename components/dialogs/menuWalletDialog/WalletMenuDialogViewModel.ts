import { makeAutoObservable } from "mobx"
import { Wallet } from "../../../store/wallet/Wallet"
import { t } from "../../../i18n"
import { getActiveRouteName, RootNavigation } from "../../../navigators"
import { NavigationProp } from "@react-navigation/native"
import { getWalletStore } from "../../../App"

export class WalletMenuDialogViewModel {
    pending = false
    display = false
    message = ""
    wallet: Wallet
    nav: NavigationProp<any>


    get items() {

        if(!this.display) return []

        const items = [ {
            name: t("walletMenuDialog.transactionHistory"),
            action: () => {
                this.display = false
                RootNavigation.navigate("mainStack", {
                    screen: "wallet",
                    params: {
                        screen: "wallet-eth-transactions",
                        params: {
                            wallet: this.wallet.address,
                            symbol: 'ETH'
                        }
                    }
                })
            },
            icon: "list-alt"
        }
        ]

        if(getWalletStore()?.wallets[0]?.address !== this.wallet?.address) {
            items.push({
                name: t("walletMenuDialog.hideWallet"),
                action: async () => {
                    this.display = false
                    const rootState = RootNavigation.getRootState()
                    if (getActiveRouteName(rootState) === "wallet-eth") {
                        RootNavigation.goBack()
                        setTimeout(async () => {
                            await getWalletStore().removeWallet(this.wallet.address)
                        }, 1000)
                    } else {
                        await getWalletStore().removeWallet(this.wallet.address)
                    }
                },
                icon: "eye-slash"
            },)
        }

        return items
    }

    constructor() {
        makeAutoObservable(this)
    }

    open(w: Wallet, nav: NavigationProp<any>) {
        this.wallet = w
        this.nav = nav
        this.display = true
    }
}
