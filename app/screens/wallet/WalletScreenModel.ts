import { makeAutoObservable, runInAction } from "mobx"
import { Wallet } from "../../services/store/WalletStore"
import "react-native-get-random-values"
import { randomBytes } from "react-native-randombytes"
import "@ethersproject/shims"
import { ethers } from "ethers"
import { entropyToMnemonic } from "ethers/lib/utils"
import { store } from "../../services/store/Store"


export class WalletScreenModel {
  initialized = false
  wallets: Array<Wallet> = []
  
  
  walletDialogs = {
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
    menu: {
      currentWallet: null,
      display: false,
      deleteConfirmation: { display: false, accept: false },
    },
  }
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
  
  async init() {
    try {
      await store.walletStore.init()
      this.wallets = store.walletStore.wallets
      this.initialized = true
      // const wallets = await storage.load("wallets") || {}
      // store.wallets = Object.values(wallets).map(w => new Wallet(w))
    } catch (e) {
      console.tron.log(e)
    }
  }
  
  createWalletInit() {
    this.walletDialogs.init.display = true
  }
  
  createWalletTogglePending() {
    this.walletDialogs.pending = !this.walletDialogs.pending
  }
  
  
  createWalletProceed = () => {
    
    // console.log(wallet)
    
    this.walletDialogs.pending = true
    setTimeout(() => {
      runInAction(() => {
        try {
          console.tron.log("CREATE-WALLET")
          // const wallet = ethers.Wallet.createRandom()
          const entropy: Uint8Array = randomBytes(16)
          const mnemonic = entropyToMnemonic(entropy, "en")
          const wallet = ethers.Wallet.fromMnemonic(mnemonic)
          this.walletDialogs.proceed.wallet.mnemonic = wallet.mnemonic.phrase
          this.walletDialogs.proceed.wallet.path = wallet.mnemonic.path
          this.walletDialogs.proceed.wallet.locale = wallet.mnemonic.locale
          this.walletDialogs.proceed.wallet.address = wallet.address
          this.walletDialogs.proceed.wallet.privateKey = wallet.privateKey
          this.walletDialogs.proceed.wallet.publicKey = wallet.publicKey
          this.walletDialogs.init.display = false
          this.walletDialogs.proceed.display = true
        } catch (e) {
          console.tron.log("ERROR", e)
        }
      })
    }, 1)
  }
  
  async saveWallet() {
    runInAction(() => {
      this.walletDialogs.proceed.display = false
      this.walletDialogs.pending = false
      this.walletDialogs.init.accept = false
    })
    try {
      await store.walletStore.addWallet(new Wallet(this.walletDialogs.proceed.wallet))
    } catch (e) {
      console.log(e)
    }
    
    runInAction(() => {
      this.walletDialogs.pending = false
    })
  }
  
  async removeWallet() {
    await store.walletStore.removeWallet(this.walletDialogs.menu.currentWallet)
    this.closeMenuDialog()
  }
  
  closeMenuDialog() {
    this.walletDialogs.menu.display = false
    this.walletDialogs.menu.deleteConfirmation.display = false
  }
}
