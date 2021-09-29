import { makeAutoObservable, reaction } from "mobx"
import { EthereumTransaction } from "../../../store/transaction/EthereumTransaction"
import { RootNavigation } from "../../../navigators"
import { runUnprotected } from "mobx-keystone"
import { getWalletStore } from "../../../App"
import { Wallet } from "../../../store/wallet/Wallet"
import { amountFormat } from "../../../utils/number"
import { ethers } from "ethers"
import { Colors } from "react-native-ui-lib"
import { t } from "../../../i18n"

export class WaitForEthTransactionViewModel {


    get display() {
        return !!this.transaction
    }

    transaction: EthereumTransaction
    wallet: Wallet
    process: 'pending' | 'cancel' | 'speedUp' | 'done' | 'error'

    get transactionActionName() {
        switch (this.process) {
            case "pending":
                return t("sendTransaction.action.pending")
            case "cancel":
                return t("sendTransaction.action.cancel")
            case "done":
                return t("sendTransaction.action.done")
            case "speedUp":
                return t("sendTransaction.action.speedUp")
            case "error":
            default:
                return t("sendTransaction.action.error")
        }
    }

    navToTransaction() {
        if (!this.transaction) return
        RootNavigation.navigate("mainStack", {
            screen: "wallet",
            params: {
                screen: "wallet-eth-transactions",
                params: {
                    wallet: this.transaction.walletAddress,
                    symbol: 'ETH'
                }
            }
        })
    }

    watchTransaction = reaction(() => this.transaction, async (val) => {
        console.log("VAL")
        if (val) {
            try {
                if (this.process) return
                this.wallet = getWalletStore().allWallets.find(w => w.address === this.transaction.walletAddress)

                this.process = "pending"
                const transaction = await val.wait()
                console.log("TRANSACTION-DONE")
                console.log({ transaction })
                if (!this.transaction) return
                runUnprotected(() => {
                    const savedTx = this.wallet.transactions.get(this.transaction.nonce)
                    savedTx.blockTimestamp = new Date()
                    savedTx.transactionIndex = transaction.transactionIndex
                    savedTx.receiptContractAddress = transaction.contractAddress
                    savedTx.receiptStatus = transaction.status.toString()
                    if (this.process === 'pending') {
                        this.wallet.transactions.set(this.transaction.nonce, savedTx)
                        this.process = 'done'
                        setTimeout(() => {
                            this.transaction = null
                        }, 10 * 1000)
                    }
                })
            } catch (e) {
                if(this.process === "pending") {
                    this.process = 'error'
                }
                console.log("ERROR-SEND", e)
            }
        }
    })

    async cancelTransaction() {
        try {
            if (this.process === 'cancel') return
            if (!this.transaction.receiptStatus && this.canRewriteTransaction) {
                this.process = 'cancel'
                const txBody = this.transaction.txBody
                txBody.gasPrice = (txBody.gasPrice * 1.5).toFixed(0).toString()
                txBody.value = "0"
                txBody.to = ethers.constants.AddressZero
                console.log({ txBody })
                await this.sendTransaction(txBody)
                this.process = 'done'
            }
        } catch (e) {
            console.log("ERROR-CANCEL", e)
        } finally {
            setTimeout(() => {
                this.transaction = null
            }, 10 * 1000)
        }
    }

    async speedUpTransaction() {
        try {
            if (!this.transaction.receiptStatus && this.canRewriteTransaction) {
                this.process = 'speedUp'
                const txBody = this.transaction.txBody
                txBody.gasPrice = (txBody.gasPrice * 1.5).toFixed(0).toString()
                await this.sendTransaction(txBody)
                this.process = 'done'
            }
        } catch (e) {
            console.log("ERROR-SPEED-UP", e)
        } finally {
            setTimeout(() => {
                this.transaction = null
            }, 10 * 1000)
        }
    }

    async sendTransaction(txBody) {
        console.log("one")
        const tx = await this.wallet.ether.sendTransaction(txBody)
        console.log("two")
        const transaction = await tx.wait()
        console.log("3")
        runUnprotected(() => {
            const savedTx = this.wallet.transactions.get(this.transaction.nonce)
            savedTx.hash = tx.hash
            savedTx.value = txBody.value
            savedTx.toAddress = txBody.to
            savedTx.blockTimestamp = new Date()
            savedTx.transactionIndex = transaction.transactionIndex
            savedTx.receiptContractAddress = transaction.contractAddress
            savedTx.receiptStatus = transaction.status.toString()
            this.wallet.transactions.set(this.transaction.nonce, savedTx)
        })
    }

    get transactionFee() {
        return +ethers.utils.formatEther(this.transaction.txBody.gasPrice * this.transaction.txBody.gasLimit)
    }

    get canRewriteTransaction() {
        return +amountFormat(this.wallet.ethBalance - this.transactionFee * 1.5, 8) > 0
    }

    constructor() {
        makeAutoObservable(this, null, { autoBind: true })
    }

    get loaderColor() {
        switch (this.process) {
            case "cancel":
                return Colors.red40
            case "pending":
                return Colors.white
            case "speedUp":
                return Colors.purple40
            default:
                return Colors.black
        }
    }
}
