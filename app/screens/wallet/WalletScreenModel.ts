import { makeAutoObservable, runInAction } from "mobx"
import { Wallet } from "../../services/store/Wallet"
import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers"
import * as storage from "../../utils/storage"
import { RootStore } from "../../models"


export class WalletScreenModel {
  initialized = false
  wallets: Array<Wallet> = []
  store: RootStore
  
  createWallet = {
    pending: false,
    init: { display: false, accept: false },
    proceed: {
      display: false,
      wallet: {
        mnemonic: "",
        path: "",
        locale: "",
        privateKey: "",
        publicKey: "",
        address: "",
        balance: 0,
        name: "",
      },
    },
  }
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    this.initialized = true
  }
  
  async init(store: RootStore) {
    try {
      this.store = store
      const wallets = await storage.load("wallets") || {}
      this.wallets = Object.values(wallets)
    } catch (e) {
      console.tron.log(e)
    }
  }
  
  createWalletInit() {
    this.createWallet.init.display = true
  }
  
  createWalletTogglePending() {
    this.createWallet.pending = !this.createWallet.pending
  }
  
  
  async createWalletProceed() {
    this.createWallet.pending = true
    setTimeout(() => {
      runInAction(() => {
        try {
          console.tron.log("CREATE-WALLET")
          const wallet = ethers.Wallet.createRandom()
          this.createWallet.proceed.wallet.mnemonic = wallet.mnemonic.phrase
          this.createWallet.proceed.wallet.path = wallet.mnemonic.path
          this.createWallet.proceed.wallet.locale = wallet.mnemonic.locale
          this.createWallet.proceed.wallet.address = wallet.address
          this.createWallet.proceed.wallet.privateKey = wallet.privateKey
          this.createWallet.proceed.wallet.publicKey = wallet.publicKey
          this.createWallet.init.display = false
          this.createWallet.proceed.display = true
        } catch (e) {
          console.tron.log("ERROR", e)
        }
      })
    }, 1)
  }
  
  async saveWallet() {
    runInAction(() => {
      this.createWallet.proceed.display = false
    })
    try {
      this.wallets = [ ...this.wallets, this.createWallet.proceed.wallet ]
      await storage.save("wallets", Object.values(this.wallets))
    } catch (e) {
      console.log(e)
    }
    
    runInAction(() => {
      this.createWallet.pending = false
    })
  }
}
