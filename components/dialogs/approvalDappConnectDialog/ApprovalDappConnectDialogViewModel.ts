import { makeAutoObservable } from "mobx"
import { getWalletStore } from "../../../App"

export class ApprovalDappConnectDialogViewModel {
    display = false
    pending = false
    approvalRequest
    hostName = ''

    constructor() {
        makeAutoObservable(this)
    }

    /**
     * When user clicks on approve to connect with a dapp
     */
    onAccountsConfirm = () => {
        this.display = false
        this.hostName = undefined
        this.approvalRequest.resolve(getWalletStore().selectedWallet?.address)
    }

    /**
     * When user clicks on reject to connect with a dapp
     */
    onAccountsRejected = () => {
        this.display = false
        this.hostName = undefined
        this.approvalRequest.resolve(false)
    }
}