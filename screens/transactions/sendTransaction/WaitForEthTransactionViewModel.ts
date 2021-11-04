import { makeAutoObservable, reaction } from "mobx"
import { EthereumTransaction } from "../../../store/wallet/transaction/EthereumTransaction"
import { runUnprotected } from "mobx-keystone"
import { getWalletStore } from "../../../App"
import { Wallet } from "../../../store/wallet/Wallet"
import { amountFormat } from "../../../utils/number"
import { ethers } from "ethers"
import { Colors } from "react-native-ui-lib"
import { t } from "../../../i18n"
import { ERC20Transaction } from "../../../store/wallet/transaction/ERC20Transaction";
import { contractAbiErc20 } from "../../../utils/abi";

export class WaitForEthTransactionViewModel {

  get display() {
    return !!this.transaction
  }

  transaction: EthereumTransaction | ERC20Transaction
  wallet: Wallet
  process: 'pending' | 'cancel' | 'speedUp' | 'done' | 'error'

  get isERC20Transaction() {
    return "address" in this.transaction
  }

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

  watchTransaction = reaction(() => this.transaction, async (val) => {
    if (val) {
      try {
        if (this.process) return
        this.wallet = getWalletStore().allWallets.find(w => w.address === this.transaction.walletAddress)

        this.process = "pending"
        const transaction = await val.wait()
        if (!this.transaction) return
        runUnprotected(() => {
          let savedTx = null
          if (!this.isERC20Transaction) {
            savedTx = this.wallet.transactions.get(this.transaction.nonce)
            savedTx.blockTimestamp = new Date()
            savedTx.transactionIndex = transaction.transactionIndex
            savedTx.receiptContractAddress = transaction.contractAddress
            savedTx.receiptStatus = transaction.status.toString()
          } else {
            this.transaction.receiptStatus = "1"
          }
          console.log("here-2")
          if (this.process === 'pending') {
            if (this.isERC20Transaction) {
              console.log("here-3")
            } else {
              this.wallet.transactions.set(this.transaction.nonce, savedTx)
            }
            this.process = 'done'
            this.transaction = null
            this.process = null
          }
        })
      } catch (e) {
        if (this.process === "pending") {
          this.process = 'error'
        }
      } finally {
        this.process = null
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
        await this.sendTransaction(txBody, this.isERC20Transaction)
        this.process = 'done'
      }
    } catch (e) {
      console.log("ERROR-CANCEL", e)
    } finally {
      this.transaction = null
      this.process = null
    }
  }

  async speedUpTransaction() {
    try {
      if (!this.transaction.receiptStatus && this.canRewriteTransaction) {
        this.process = 'speedUp'
        const txBody = this.transaction.txBody
        txBody.gasPrice = (txBody.gasPrice * 1.5).toFixed(0).toString()
        if (this.isERC20Transaction) {
          const contract = new ethers.Contract((this.transaction as ERC20Transaction).address, contractAbiErc20, this.wallet.ether);
          const tx = await contract.transfer(this.transaction.toAddress, this.transaction.value, {
            gasPrice: txBody.gasPrice,
            gasLimit: txBody.gasLimit
          })
          await tx.wait()
          this.transaction.receiptStatus = 1
        } else {
          await this.sendTransaction(txBody)
        }
        this.process = 'done'
      }
    } catch (e) {
      console.log("ERROR-SPEED-UP", e)
    } finally {
      setTimeout(() => {
        this.transaction = null
        this.process = null
      }, 10 * 1000)
    }
  }

  async sendTransaction(txBody, isErc20 = false) {
    try {
      let tr = {}
      if (isErc20) {
        const { address, ...other } = txBody
        tr = other
      } else {
        tr = txBody
      }

      const tx = await this.wallet.ether.sendTransaction(tr)
      const transaction = await tx.wait()
      runUnprotected(() => {

        const savedTx = isErc20 ? this.transaction :
            this.wallet.transactions.get(this.transaction.nonce)
        if (isErc20) {
          savedTx.transactionHash = tx.hash
        } else {
          savedTx.hash = tx.hash
          savedTx.transactionIndex = transaction.transactionIndex
          savedTx.receiptContractAddress = transaction.contractAddress
        }

        savedTx.value = txBody.value
        savedTx.toAddress = txBody.to
        savedTx.blockTimestamp = new Date()
        savedTx.receiptStatus = transaction.status.toString()
        if (!isErc20) {
          this.wallet.transactions.set(this.transaction.nonce, savedTx)
        }
      })
    } catch (e) {
      console.log("ERROR-SEND", e)
    }
  }

  get transactionFee() {
    return +ethers.utils.formatEther(this.transaction.txBody.gasPrice * this.transaction.txBody.gasLimit)
  }

  get canRewriteTransaction() {
    return +amountFormat(this.wallet.valBalance - this.transactionFee * 1.5, 8) > 0
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
