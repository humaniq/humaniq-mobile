import { makeAutoObservable, runInAction } from "mobx"
import { Wallet } from "../../services/store/Wallet"
import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers"
import * as storage from "../../utils/storage"


export class WalletScreenModel {
  counter = 0
  wallets: Array<Wallet> = []
  
  createWallet = {
    pending: false,
    init: { display: false, accept: false },
    proceed: {
      display: false,
      mnemonic: "",
      path: "",
      locale: "",
      privateKey: "",
      public: "",
      address: "",
      balance: 0,
    },
  }
  
  constructor() {
    makeAutoObservable(this)
  }
  
  init = async () => {
    try {
      console.tron.log("INIT")
      const wallets = await storage.load("wallets") || {}
      console.tron.log("WALLETS", JSON.stringify(wallets))
    } catch (e) {
      console.tron.log(e)
    }
  }
  
  createWalletInit = () => {
    this.createWallet.init.display = true
  }
  
  createWalletTogglePending = () => {
    this.createWallet.pending = !this.createWallet.pending
  }
  
  
  createWalletProceed = async () => {
    this.createWallet.pending = true
    setTimeout(() => {
      runInAction(() => {
        try {
          console.tron.log("CREATE-WALLET")
          const wallet = ethers.Wallet.createRandom()
          this.createWallet.proceed.mnemonic = wallet.mnemonic.phrase
          this.createWallet.proceed.path = wallet.mnemonic.path
          this.createWallet.proceed.locale = wallet.mnemonic.locale
          this.createWallet.proceed.address = wallet.address
          this.createWallet.proceed.privateKey = wallet.privateKey
          this.createWallet.proceed.public = wallet.publicKey
          this.createWallet.init.display = false
          this.createWallet.proceed.display = true
        } catch (e) {
          console.tron.log("ERROR", e)
        }
      })
    }, 1)
  }
  
  saveWallet = async () => {
    runInAction(() => {
      this.createWallet.proceed.display = false
    })
    
    runInAction(async () => {
      
      const wallets = await storage.load("wallets")
      console.tron.log("WALLETS", wallets)
      const { proceed } = this.createWallet
      delete proceed.display
      proceed.balance = 0
      wallets[proceed.address] = proceed
      console.tron.log("SAVE-WALLETS", wallets)
      storage.save("wallets", wallets).then(wallets => {
        this.wallets = Object.values(wallets)
      })
    })
  }


// newAddress = async (): Promise<void> => {
//   if (typeof this.createWallet.proceed.keystore.getHexAddress !== "function") {
//     return
//   }
//
//   const wallet = this.createWallet.proceed.keystore
//
//   this.createWallet.proceed.privateKey = wallet.getHexPrivateKey()
//   this.createWallet.proceed.address = wallet.getHexAddress(true)
//
//   wallet.toV3String(this.createWallet.proceed.password, {}, async (err, v3Json) => {
//     if (err) {
//       console.tron.log("Couldn't stringify wallet, error: " + err.message)
//       callback()
//       return
//     }
//
//     this.createWallet.proceed.keystoreJson = v3Json
//     this.createWallet.proceed.keystoreJsonDataLink = encodeURI("data:application/json;charset=utf-8," + this.createWallet.proceed.keystoreJson)
//     this.createWallet.proceed.fileName = `${ wallet.getV3Filename() }.json`
//
//     const wallets = JSON.parse(await AsyncStorage.getItem("wallets")) || {}
//     const { proceed } = this.createWallet
//     delete proceed.display
//     proceed.type = "ether"
//     proceed.balance = 0
//     wallets[proceed.address] = proceed
//     await AsyncStorage.setItem("wallets", wallets)
//     this.wallets = Object.values(wallets)
//
//     callback()
//     this.createWallet.proceed.display = true
//     this.createWallet.init.accept = false
//   })
// }
}
