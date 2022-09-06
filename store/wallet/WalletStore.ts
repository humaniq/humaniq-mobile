import { _await, Model, model, modelAction, modelFlow, runUnprotected, tProp as p, types as t, } from "mobx-keystone"
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
import { profiler } from "../../utils/profiler/profiler";
import { EVENTS, MARKETING_EVENTS } from "../../config/events";
import { events } from "../../utils/events";


export enum ON_TOP_ITEM {
    FIAT = 'FIAT',
    TOKEN = 'TOKEN'
}

export enum SHOW_GRAPHS {
    GRAPH = 'GRAPH',
    TOKEN = 'TOKEN'
}

@model("WalletStore")
export class WalletStore extends Model({
    pending: p(t.boolean, false),
    initialized: p(t.string, ""),
    allWallets: p(t.array(t.model<Wallet>(Wallet)), () => []),
    hiddenWallets: p(t.array(t.string), []),
    selectedWalletIndex: p(t.number, 0).withSetter(),
    currentFiatCurrency: p(t.enum(CURRENCIES), CURRENCIES.USD).withSetter(),
    onTopCurrency: p(t.enum(ON_TOP_ITEM), ON_TOP_ITEM.FIAT).withSetter(),
    showGraphs: p(t.enum(SHOW_GRAPHS), SHOW_GRAPHS.TOKEN).withSetter(),
}) {

    get fiatOnTop() {
        return this.onTopCurrency === ON_TOP_ITEM.FIAT
    }

    get showGraphBool() {
        return this.showGraphs === SHOW_GRAPHS.GRAPH
    }

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
        return this?.wallets[this.selectedWalletIndex]
    }

    @modelAction
    selectWallet(index) {
        this.selectedWalletIndex = index
    }

    @modelFlow
    * register() {
        reaction(() => getEVMProvider().initialized, () => {
            this.init(true)
        })
        reaction(() => getAppStore().savedPin, async (pin) => {
            if (pin && getAppStore().lockerPreviousScreen !== AUTH_STATE.REGISTER) {
                await runUnprotected(async () => {
                    const cryptr = new Cryptr(pin)
                    const encrypted = await localStorage.load("hm-wallet")
                    if (encrypted) {
                        const result = cryptr.decrypt(encrypted)
                        this.storedWallets = JSON.parse(result)
                        await this.init()
                    }
                })
            }
        })
    }

    @modelFlow
    * init(forse = false) {
        if (!this.initialized || forse) {
            this.pending = true
            const id = profiler.start(EVENTS.INIT_WALLET_STORE)

            if (this.storedWallets) {
                if (!this.keyring.mnemonic) {
                    this.keyring = new HDKeyring(this.storedWallets.mnemonic)
                }
                this.allWallets = this.storedWallets.allWallets.map(w => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const wallet = new Wallet({
                        privateKey: normalize(Buffer.from(w.privateKey.data).toString("hex")),
                        publicKey: normalize(Buffer.from(w.publicKey.data).toString("hex")),
                        address: ethers.utils.computeAddress(normalize(Buffer.from(w.privateKey.data).toString("hex")))
                    })
                    wallet.initWallet()
                    return wallet
                }) || []

                const currentFiatCurrency = (yield* _await(storage.load("currentFiatCurrency"))) || CURRENCIES.USD
                // @ts-ignore
                getWalletStore().setCurrentFiatCurrency(currentFiatCurrency)

                const onTop = (yield* _await(localStorage.load("hm-wallet-settings-fiat-on-top")))
                this.onTopCurrency = onTop === null ? ON_TOP_ITEM.FIAT : onTop

                const showGraphs = (yield* _await(localStorage.load("hm-wallet-settings-show-graphs")))
                this.showGraphs = showGraphs === null ? SHOW_GRAPHS.TOKEN : showGraphs

                this.initialized = uuidv4()
                this.pending = false
            }
            profiler.end(id)
        }
    }

    @computed
    get allWalletsInitialized() {
        return this.allWallets.length ? this.allWallets.every(w => w.initialized) : false
    }

    @modelFlow
    * updateWalletsInfo() {
        this.allWallets.forEach(w => w.initWallet(true))
    }

    @modelAction
    * resetStore() {
        this.storedWallets = null
    }

    @modelFlow
    * addWallet() {
        try {
            events.send(MARKETING_EVENTS.CREATE_NEW_ADDRESS)
            const wallets = yield this.createWallet()
            const cryptr = new Cryptr(getAppStore().savedPin)
            const encoded = yield* _await(cryptr.encrypt(JSON.stringify(wallets)))
            yield* _await(localStorage.save("hm-wallet", encoded))
            this.storedWallets = JSON.parse(JSON.stringify(wallets))
            events.send(MARKETING_EVENTS.CREATE_NEW_ADDRESS_SUCCESSFUL)

            const wallet = new Wallet({
                privateKey: normalize(Buffer.from(this.storedWallets.allWallets[this.storedWallets.allWallets.length - 1].privateKey.data).toString("hex")),
                publicKey: normalize(Buffer.from(this.storedWallets.allWallets[this.storedWallets.allWallets.length - 1].publicKey.data).toString("hex")),
                address: ethers.utils.computeAddress(normalize(Buffer.from(this.storedWallets.allWallets[this.storedWallets.allWallets.length - 1].privateKey.data).toString("hex")))
            })

            wallet.initWallet()
            this.allWallets = [ ...this.allWallets, wallet]

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
        yield* _await(this.keyring.addAccounts())
        const mnemonic = (yield* _await(this.keyring.serialize())) as unknown
        return {
            mnemonic,
            allWallets: this.keyring.wallets
        }
    }
}
