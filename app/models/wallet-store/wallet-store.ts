import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { WalletModel, WalletSnapshot } from "../wallet/wallet"
import { withEnvironment } from "../extensions/with-environment"

/**
 * Model description here for TypeScript hints.
 */
export const WalletStoreModel = types
  .model("WalletStore")
  .props({
    wallets: types.optional(types.array(WalletModel), []),
  })
  .extend(withEnvironment)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    saveWallets: (wallets: WalletSnapshot []) => {
      self.wallets.replace(wallets)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    addWallet: async (wallet: WalletSnapshot) => {
      self.wallets.push(wallet)
      console.log(self.wallets)
      console.tron.log(self.wallets)
      // const wallets = await storage.load("wallets") || {}
      // wallets[wallet.address] = wallet
      // console.tron.log(wallets)
      // self.saveWallets([ wallet ])
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type WalletStoreType = Instance<typeof WalletStoreModel>

export interface WalletStore extends WalletStoreType {
}

type WalletStoreSnapshotType = SnapshotOut<typeof WalletStoreModel>

export interface WalletStoreSnapshot extends WalletStoreSnapshotType {
}

export const createWalletStoreDefaultModel = () => types.optional(WalletStoreModel, {})
