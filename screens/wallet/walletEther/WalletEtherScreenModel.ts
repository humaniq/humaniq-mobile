import { makeAutoObservable, runInAction } from "mobx"
import { getEthereumProvider, getWalletStore } from "../../../App"


export class WalletEtherScreenModel {
    initialized = false
    currentWalletAddress
    refreshing = false

    walletDialogs: {
        pending: false
        send: { display: false }
    }

    constructor() {
        makeAutoObservable(this)
    }

    get sendDisabled() {
        return false
    }

    get wallet() {
        return getWalletStore().allWallets.find(w => w.address === this.currentWalletAddress)
    }

    async init(address) {
        this.currentWalletAddress = address

        this.initialized = true
        try {
            getEthereumProvider().currentNetworkName !== 'mainnet' ?
              await this.wallet.updateBalanceFromProvider() :
              await this.wallet.updateBalanceFromApi()
        } catch (e) {
            console.log("ERROR", e)
        } finally {
            runInAction(() => {
                this.initialized = true
            })
        }
    }

    async onRefresh() {
        this.refreshing = true
        await getWalletStore().updateWalletsInfo()
        this.refreshing = false
    }
}
