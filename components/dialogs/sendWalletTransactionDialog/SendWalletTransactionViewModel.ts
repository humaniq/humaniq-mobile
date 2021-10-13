import { makeAutoObservable } from "mobx"
import { Wallet } from "../../../store/wallet/Wallet"
import { BigNumber, ethers } from "ethers"
import { getEthereumProvider, getWalletStore } from "../../../App"
import { amountFormat, currencyFormat } from "../../../utils/number"
import { EthereumTransaction } from "../../../store/wallet/transaction/EthereumTransaction"
import { runUnprotected } from "mobx-keystone"
import { inject } from "react-ioc"
import { WaitForEthTransactionViewModel } from "../../toasts/waitForEthTransaction/WaitForEthTransactionViewModel"

export class SendWalletTransactionViewModel {
    display = false
    pending = false
    pendingTransaction = false
    initialized = false
    wallet: Wallet
    symbol = "ETH"
    commissionSelectExpanded = false
    txData = {
        chainId: 0,
        gas: 0,
        gasPrice: 0,
        nonce: "",
        value: "0",
        to: "",
        estimateGas: "",
    }

    txError = false
    message = ""

    gasSpeed = {
        low: false,
        medium: true,
        fast: false
    }

    ethTransactionToast = inject(this, WaitForEthTransactionViewModel)

    get estimateGasLimit() {
        switch (true) {
            case this.gasSpeed.medium:
                return 21000 * 1.5
            case this.gasSpeed.fast:
                return 21000 * 2
            default:
                return 21000
        }
    }

    changeGasSpeed(speed) {
        this.gasSpeed = {
            low: speed === 'low',
            medium: speed === 'medium',
            fast: speed === 'fast'
        }
    }

    async init() {
        this.pending = true
        this.display = true
        this.txData.chainId = getEthereumProvider().currentNetwork.chainID

        const [ nonce, estimateGas ] = await Promise.all([
            await getEthereumProvider().currentProvider.getTransactionCount(this.wallet.address, "pending"),
            await getEthereumProvider().currentProvider.getGasPrice()
        ])

        this.txData.nonce = nonce
        this.txData.estimateGas = estimateGas.toString()
        this.pending = false
        this.initialized = true
    }

    get price() {
        return getWalletStore().selectedWallet.prices?.usd || 0
    }

    get transactionMaxFee() {
        return this.txData.gasPrice ? +ethers.utils.formatEther(this.txData.gasPrice * this.txData.gas) : 0
    }

    get transactionFee() {
        return this.txData.estimateGas ? +ethers.utils.formatEther(+this.txData.estimateGas * this.estimateGasLimit) : 0
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

    get diffBalanceTotal() {
        return +amountFormat(this.wallet.valBalance - this.transactionTotalAmount, 8)
    }

    get enoughBalance() {
        return this.diffBalanceTotal >= 0
    }


    get isTransferAllow() {
        if (!this.wallet.balances.amount || !this.parsedValue || !this.enoughBalance || !this.txBody.to) return false
        return BigNumber.from(this.wallet.balances.amount)
          .gt(ethers.utils.parseEther(this.txData.value).add(
              BigNumber.from(this.estimateGasLimit * this.txData.gasPrice)
            )
          )
    }

    get txBody() {
        return {
            chainId: this.txData.chainId,
            nonce: this.txData.nonce,
            gasPrice: this.txData.estimateGas,
            gasLimit: this.estimateGasLimit,
            to: this.txData.to,
            from: this.wallet.address,
            value: ethers.utils.parseEther(this.parsedValue.toString()),
        }
    }

    sendTx = async () => {
        try {
            if (this.pendingTransaction) return
            this.pendingTransaction = true

            const etxBody = {
                chainId: this.txBody.chainId.toString(),
                nonce: this.txBody.nonce.toString(),
                gasPrice: this.txBody.gasPrice.toString(),
                gas: this.txBody.gasLimit.toString(),
                value: this.txBody.value.toString(),
                walletAddress: this.wallet.address,
                toAddress: this.txBody.to,
                fromAddress: this.txBody.from,
                input: "0x",
                blockTimestamp: new Date()
            }

            const etx = new EthereumTransaction(etxBody)
            const tx = await this.wallet.ether.sendTransaction(this.txBody)

            runUnprotected(() => {
                etx.hash = tx.hash
                etx.wait = tx.wait
                this.wallet.transactions.set(tx.nonce, etx)
                this.ethTransactionToast.transaction = etx
            })
            this.pendingTransaction = false
            this.closeDialog()
        } catch (e) {
            this.txError = true
            console.log("ERROR", e)
        }
    }

    closeDialog = () => {
        if (this.pendingTransaction) return
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
        }
        this.pendingTransaction = false
        this.display = false
    }

    constructor() {
        makeAutoObservable(this)
    }
}
