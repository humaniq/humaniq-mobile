import {
    _await,
    getSnapshot,
    Model,
    model,
    modelAction,
    modelFlow,
    runUnprotected,
    tProp as p,
    types as t,
} from "mobx-keystone"
import { computed, observable, reaction } from "mobx"
import * as storage from "../../utils/localStorage"
import { localStorage } from "../../utils/localStorage"
import { v4 as uuidv4 } from 'uuid';
import { Wallet } from "./Wallet"
import "react-native-get-random-values"
import "@ethersproject/shims"
import HDKeyring from "eth-hd-keyring"
import { normalize } from "eth-sig-util"
import { ethers } from "ethers"
import Cryptr from "react-native-cryptr"
import { getAppStore, getEVMProvider, getWalletStore } from "../../App"
import { AUTH_STATE } from "../../screens/auth/AuthViewModel"
import { currencyFormat } from "../../utils/number";
import { CURRENCIES, CURRENCIES_ARR } from "../../config/common";

@model("WalletStore")
export class WalletStore extends Model({
    pending: p(t.boolean, false),
    initialized: p(t.string, ""),
    allWallets: p(t.array(t.model<Wallet>(Wallet)), () => []),
    hiddenWallets: p(t.array(t.string), []),
    selectedWalletIndex: p(t.number, 0).withSetter(),
    currentFiatCurrency: p(t.enum(CURRENCIES), CURRENCIES.USD).withSetter()
}) {

    @modelAction
    changeCurrentFiatCurrency = () => {
        const index = CURRENCIES_ARR.findIndex(c => c === this.currentFiatCurrency)
        this.currentFiatCurrency = CURRENCIES_ARR[index + 1] || CURRENCIES_ARR[0]
        storage.save("currentFiatCurrency", this.currentFiatCurrency)
    }

    @observable
    keyring = new HDKeyring()

    @observable
    storedWallets

    @computed
    get walletsMap() {
        return this.allWallets.reduce((map, obj) => {
            map.set(obj.address, obj);
            return map;
        }, new Map);
    }

    @computed
    get wallets() {
        return this.allWallets.filter(h => !this.hiddenWallets.includes(h.address))
    }

    @computed
    get formatTotalAllWalletsFiatBalance() {
        return currencyFormat(this.wallets.reduce((acc, w) => {
            acc += w.totalWalletFiatBalance
            return acc
        }, 0))
    }

    @computed
    get selectedWallet() {
        return this.wallets[this.selectedWalletIndex]
    }

    @modelAction
    selectWallet(index) {
        this.selectedWalletIndex = index
    }

    @modelFlow
    * init(forse = false) {
        if (!this.initialized || forse) {
            const currentFiatCurrency = (yield* _await(storage.load("currentFiatCurrency"))) || CURRENCIES.USD
            // @ts-ignore
            getWalletStore().setCurrentFiatCurrency(currentFiatCurrency)

            if (this.storedWallets) {
                if (!this.keyring.mnemonic) {
                    this.keyring = new HDKeyring(this.storedWallets.mnemonic)
                }
                this.hiddenWallets = (yield* _await(localStorage.load("hw-wallet-hidden"))) || []
                this.allWallets = this.storedWallets.allWallets.map(w => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const wallet = new Wallet({
                        privateKey: normalize(Buffer.from(w.privateKey.data).toString("hex")),
                        publicKey: normalize(Buffer.from(w.publicKey.data).toString("hex")),
                        address: ethers.utils.computeAddress(normalize(Buffer.from(w.privateKey.data).toString("hex")))
                    })
                    wallet.init()
                    return wallet
                }) || []
                this.initialized = uuidv4()
            }
            if (!this.initialized) {
                reaction(() => getSnapshot(getEVMProvider().initialized), () => {
                    this.init(true)
                })
                reaction(() => getSnapshot(getAppStore().savedPin), async (pin) => {
                    if (pin && getAppStore().lockerPreviousScreen !== AUTH_STATE.REGISTER) {
                        await runUnprotected(async () => {
                            const cryptr = new Cryptr(pin)
                            const encrypted = await localStorage.load("hm-wallet")
                            const result = cryptr.decrypt(encrypted)
                            this.storedWallets = JSON.parse(result)
                            await this.init()
                            // runUnprotected(() => this.initialized = uuid.v4())
                            // getAuthStore().registrationOrLogin(getWalletStore().allWallets[0].address)
                        })
                    }
                })
                reaction(() => getSnapshot(getAppStore().isLocked), (value) => {
                    if (value) {
                        this.storedWallets = null
                    }
                })
            }
        }
    }

    @computed
    get allWalletsInitialized() {
        return this.allWallets.length ? this.allWallets.every(w => w.initialized) : false
    }

    @modelFlow
    * updateWalletsInfo() {
        this.allWallets.forEach(w => w.init(true))
    }

    @modelAction
    * resetStore() {
        this.storedWallets = null

    }

    @modelFlow
    * addWallet() {
        try {
            const wallet = yield this.createWallet()
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
        this.allWallets = this.allWallets.filter(w => w.address !== address)
    };


    @modelFlow
    * createWallet(recoveryPhrase?: string) {
        this.keyring = recoveryPhrase ? new HDKeyring({ mnemonic: recoveryPhrase }) : this.storedWallets ? new HDKeyring(this.storedWallets.mnemonic) : new HDKeyring()
        if (recoveryPhrase) {
            yield* _await(localStorage.clear())
        }
        yield* _await(this.keyring.addAccounts())
        // eslint-disable-next-line @typescript-eslint/ban-types
        const mnemonic = (yield* _await(this.keyring.serialize())) as {}
        return {
            mnemonic,
            allWallets: this.keyring.wallets
        }
    }
}
