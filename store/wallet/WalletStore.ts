import { _await, getSnapshot, Model, model, modelAction, modelFlow, tProp as p, types as t } from "mobx-keystone"
import { observable, reaction } from "mobx"
import { localStorage } from "../../utils/localStorage"
import uuid from "react-native-uuid"
import { Wallet } from "./Wallet"
import "react-native-get-random-values"
import "@ethersproject/shims"
import HDKeyring from "eth-hd-keyring"
import { normalize } from "eth-sig-util"
import { ethers } from "ethers"
import Cryptr from "react-native-cryptr"
import { getAppStore, getAuthStore, getEthereumProvider, getWalletStore } from "../../App"
import { AUTH_STATE } from "../../screens/auth/AuthViewModel"

@model("WalletStore")
export class WalletStore extends Model({
    pending: p(t.boolean, false),
    initialized: p(t.string, ""),
    wallets: p(t.array(t.model<Wallet>(Wallet)), () => []),
    hiddenWallets: p(t.array(t.string), [])
}) {

    @observable
    keyring = new HDKeyring()

    @observable
    storedWallets

    @modelFlow
    * init(forse = false) {
        if (!this.initialized || forse) {
            if (this.storedWallets) {
                this.hiddenWallets = (yield* _await(localStorage.load("hw-wallet-hidden"))) || []
                this.wallets = this.storedWallets.wallets.map(w => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const wallet = new Wallet({
                        privateKey: normalize(Buffer.from(w.privateKey.data).toString("hex")),
                        publicKey: normalize(Buffer.from(w.publicKey.data).toString("hex")),
                        address: ethers.utils.computeAddress(normalize(Buffer.from(w.privateKey.data).toString("hex")))
                    })
                    wallet.init()
                    return wallet
                }).filter(h => !this.hiddenWallets.includes(h.address)) || []
            }
            if (!this.initialized) {
                reaction(() => this.storedWallets, (val) => {
                    // console.log("Wallets=>", val)
                })
                reaction(() => getSnapshot(getEthereumProvider().initialized), () => {
                    this.init(true)
                })
                reaction(() => getSnapshot(getAppStore().savedPin), async (pin) => {
                    if (pin && getAppStore().lockerPreviousScreen !== AUTH_STATE.REGISTER) {
                        const cryptr = new Cryptr(pin)
                        const encrypted = await localStorage.load("hm-wallet")
                        const result = cryptr.decrypt(encrypted)
                        this.storedWallets = JSON.parse(result)
                        await this.init(true)
                        getAuthStore().registrationOrLogin(getWalletStore().wallets[0].address)
                    }
                })
                reaction(() => getSnapshot(getAppStore().isLocked), (value) => {
                    if (value) {
                        this.storedWallets = null
                    }
                })
            }
            this.initialized = uuid.v4()
        }
    }

    @modelFlow
    * updateWalletsInfo() {
        this.wallets.forEach(w => w.init())
    }

    @modelAction
    * resetStore() {
        this.storedWallets = null

    }

    @modelFlow
    * addWallet() {
        try {
            const wallet = yield this.createWallet()
            console.log(getAppStore().savedPin)
            const cryptr = new Cryptr(getAppStore().savedPin)
            const encoded = yield* _await(cryptr.encrypt(JSON.stringify(wallet)))
            yield* _await(localStorage.save("hm-wallet", encoded))
            this.storedWallets = JSON.parse(JSON.stringify(wallet))
            this.init(true)
        } catch (e) {
            console.log("ERROR", e)
        }
    }

    @modelFlow
    * removeWallet(address: string) {
        const hiddenWallets = (yield* _await(localStorage.load("hw-wallet-hidden"))) || []
        hiddenWallets.push(address)
        yield* _await(localStorage.save("hw-wallet-hidden", hiddenWallets))
        this.wallets = this.wallets.filter(w => w.address !== address)
    };


    @modelFlow
    * createWallet(recoveryPhrase?: string) {
        this.keyring = recoveryPhrase ? new HDKeyring({ mnemonic: recoveryPhrase }) : this.storedWallets ? new HDKeyring(this.storedWallets.mnemonic) : new HDKeyring()
        if (recoveryPhrase) {
            yield* _await(localStorage.clear())
        }
        yield* _await(this.keyring.addAccounts())
        const mnemonic = (yield* _await(this.keyring.serialize())) as {}
        return {
            mnemonic,
            wallets: this.keyring.wallets
        }
    }
}
