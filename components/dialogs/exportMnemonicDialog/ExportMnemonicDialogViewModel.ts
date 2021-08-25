import { makeAutoObservable } from "mobx"
import { getWalletStore } from "../../../store/wallet/WalletStore"

export class ExportMnemonicDialogViewModel {
    pending = false
    display = false

    constructor() {
        makeAutoObservable(this)
    }

    get recoveryPhrase() {
        return getWalletStore().storedWallets.mnemonic.mnemonic.split(" ")
    }
}
