import { Instance, SnapshotOut, types as t } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const WalletModel = t
  .model("Wallet")
  .props({
    address: t.string,
    name: t.maybe(t.string),
    balance: t.maybe(t.number),
    mnemonic: t.string,
    path: t.string,
    locale: t.string,
    privateKey: t.string,
    publicKey: t.string,
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

type WalletType = Instance<typeof WalletModel>

export interface Wallet extends WalletType {
}

type WalletSnapshotType = SnapshotOut<typeof WalletModel>

export interface WalletSnapshot extends WalletSnapshotType {
}

export const createWalletDefaultModel = () => t.optional(WalletModel, {})
