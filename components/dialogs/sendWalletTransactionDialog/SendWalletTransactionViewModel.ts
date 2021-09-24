import { makeAutoObservable } from "mobx"
import { Wallet } from "../../../store/wallet/Wallet"
import { BigNumber, ethers } from "ethers"
import { getEthereumProvider, getWalletStore } from "../../../App"
import { amountFormat, currencyFormat } from "../../../utils/number"

export class SendWalletTransactionViewModel {
    display = false
    pending = false
    pendingTransaction = null
    initialized = false
    wallet: Wallet
    symbol = "ETH"
    txData = {
        chainId: 0,
        gas: 0,
        gasPrice: 0,
        nonce: "",
        value: "0",
        to: "",
        estimateGas: "",
        estimateGasLimit: 21000,
    }

    txError = false
    message = ""

    async init() {
        this.pending = true
        this.display = true
        this.initialized = true
        this.txData.chainId = getEthereumProvider().currentNetwork.chainID

        const [ nonce, estimateGas ] = await Promise.all([
            await getEthereumProvider().currentProvider.getTransactionCount(this.wallet.address, "pending"),
            await getEthereumProvider().currentProvider.getGasPrice()
        ])

        this.txData.nonce = nonce
        this.txData.estimateGas = estimateGas
        this.pending = false
    }

    get price() {
        return getWalletStore().selectedWallet.prices?.usd || 0
    }

    get transactionMaxFee() {
        return this.txData.gasPrice ? +ethers.utils.formatEther(this.txData.gasPrice * this.txData.gas) : 0
    }

    get transactionFee() {
        return this.txData.estimateGas ? +ethers.utils.formatEther(+this.txData.estimateGas * this.txData.estimateGasLimit) : 0
    }

    get transactionTotalAmount() {
        return this.txData.estimateGas && this.parsedValue ? +this.parsedValue + this.transactionFee : 0
    }

    get parsedValue() {
        return Number(this.txData.value) ? Number(this.txData.value).toString() : 0
    }

    get txHumanReadable() {
        return {
            value: this.parsedValue,
            valueFiat: this.parsedValue ? currencyFormat(+this.parsedValue * this.price) : currencyFormat(0),
            feeMax: this.transactionMaxFee,
            fee: this.transactionFee,
            feeFiat: currencyFormat(this.transactionFee * this.price),
            total: this.transactionTotalAmount,
            totalFiat: currencyFormat(+this.transactionTotalAmount * this.price),
            maxAmount: this.parsedValue ? +this.parsedValue + this.transactionMaxFee : 0
        }
    }

    get txBody() {
        return {
            chainId: this.txData.chainId,
            nonce: this.txData.nonce,
            gasPrice: this.txData.estimateGas,
            gasLimit: this.txData.estimateGasLimit,
            to: this.txData.to,
            from: this.wallet.address,
            value: ethers.utils.parseEther(this.parsedValue.toString())
        }
    }

    get diffBalanceTotal() {
        return +amountFormat(this.wallet.ethBalance - this.transactionTotalAmount, 8)
    }

    get enoughBalance() {
        return this.diffBalanceTotal >= 0
    }


    get isTransferAllow() {
        if (!this.wallet.balances.amount || !this.parsedValue) return false
        return BigNumber.from(this.wallet.balances.amount)
          .gt(ethers.utils.parseEther(this.txData.value).add(
              BigNumber.from(this.txData.estimateGasLimit * this.txData.gasPrice)
            )
          )
    }

    sendTx = async () => {
        try {
            console.log(this.txBody)
            this.pendingTransaction = this.txBody
            const tx = await this.wallet.ether.sendTransaction(this.txBody)
            this.pendingTransaction = tx
            try {
                const transaction = await tx.wait()
                console.log({ transaction })
            } catch (e) {

            }
            // try {
            //     const result = await getRequest().post(formatRoute(ROUTES.TX.SEND_TRANSACTION, { type: "eth" }), { raw_tx: tx })
            //     this.message = result.ok ? t("sendTransactionDialog.successTx") : t("sendTransactionDialog.errorTx")
            // } catch (e) {
            //     console.log("ERROR", e)
            // }
        } catch (e) {
            this.txError = true
            console.log("ERROR", e)
        }
    }

    closeDialog = () => {
        this.pending = true
        this.initialized = false
        this.txData = {
            chainId: 0,
            gas: 0,
            gasPrice: 0,
            nonce: "",
            value: "0",
            to: "",
            estimateGas: "",
            estimateGasLimit: 21000,
            from: ""
        }
        this.display = false
    }

    constructor() {
        makeAutoObservable(this)
    }
}
