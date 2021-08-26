import { _await, getSnapshot, Model, model, modelAction, modelFlow, tProp as p, types as t } from "mobx-keystone"
import { reaction } from "mobx"
import { localStorage } from "../../utils/localStorage"
import uuid from "react-native-uuid"
import { Wallet } from "./Wallet"
import "react-native-get-random-values"
import "@ethersproject/shims"
import HDKeyring from "eth-hd-keyring"
import { normalize } from "eth-sig-util"
import { ethers } from "ethers"
import Cryptr from "react-native-cryptr"
import { getAppStore, getEthereumProvider } from "../../App"

@model("WalletStore")
export class WalletStore extends Model({
    pending: p(t.boolean, false),
    initialized: p(t.string, ""),
    wallets: p(t.array(t.model<Wallet>(Wallet)), () => []),
    hiddenWallets: p(t.array(t.string), [])
}) {

    keyring = new HDKeyring()
    storedWallets

    @modelFlow
    * init(forse = false) {
        if (!this.initialized || forse) {
            if (this.storedWallets) {
                // yield* _await(localStorage.save("hw-wallet-hidden", []))
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
            if(!this.initialized) {
                reaction(() => getSnapshot(getEthereumProvider().initialized), () => {
                    this.init(true)
                })
                reaction(() => getSnapshot(getAppStore().savedPin), (pin) => {
                    console.log("pin-settled")
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
            console.log(this.storedWallets)
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
