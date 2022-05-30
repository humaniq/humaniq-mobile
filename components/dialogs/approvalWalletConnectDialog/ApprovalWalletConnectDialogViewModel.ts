import { makeAutoObservable } from "mobx"
import { getWalletStore } from "../../../App"

export class ApprovalWalletConnectDialogViewModel {
    display = false
    pending = false
    approvalRequest
    sessionData: any

    constructor() {
        makeAutoObservable(this)
    }

    /**
     * When user clicks on approve to connect with a dapp
     */
    onAccountsConfirm = () => {
        this.display = false
        this.approvalRequest.resolve(getWalletStore().selectedWallet?.address)
    }

    /**
     * When user clicks on reject to connect with a dapp
     */
    onAccountsRejected = () => {
        this.display = false
        this.approvalRequest.resolve(false)
    }
}
