import { makeAutoObservable } from "mobx"
import { getEthereumProvider, getWalletStore } from "../../../App"
import { ethers } from "ethers"
import { amountFormat, currencyFormat } from "../../../utils/number"

export class SendTransactionViewModel {
    display = false
    pending = false
    initialized = false
    symbol = "ETH"
    txHash = ""

    approvalRequest

    meta: {
        url: ""
    }

    txData = {
        chainId: 0,
        gas: 0,
        gasPrice: 0,
        nonce: "",
        value: "",
        to: "",
        estimateGas: "",
        estimateGasLimit: 21000,
        from: ""
    }

    constructor() {
        makeAutoObservable(this)
    }

    async init(txData, meta) {
        this.pending = true
        this.meta = meta
        this.txData = {
            ...this.txData,
            ...txData
        }
        this.display = true
        this.initialized = true
        this.txData.chainId = getEthereumProvider().currentNetwork.chainID
        const [ nonce, estimateGas ] = await Promise.all([
            await getEthereumProvider().currentProvider.getTransactionCount(this.selectedWallet.address, "pending"),
            await getEthereumProvider().currentProvider.getGasPrice()
        ])
        this.txData.nonce = nonce
        this.txData.estimateGas = estimateGas
        this.pending = false
    }

    get hostname() {
        return this.meta?.url ? new URL(this.meta.url).hostname : ""
    }

    get selectedWallet() {
        return getWalletStore().selectedWallet
    }

    get transactionMaxFee() {
        return this.txData.gasPrice ? +ethers.utils.formatEther(this.txData.gasPrice * this.txData.gas) : 0
    }

    get transactionFee() {
        return this.txData.estimateGas ? +ethers.utils.formatEther(+this.txData.estimateGas * this.txData.estimateGasLimit) : 0
    }

    get transactionTotalAmount() {
        return this.txData.estimateGas ? +ethers.utils.formatEther(this.txData.value) + this.transactionFee : 0
    }

    get price() {
        return getWalletStore().selectedWallet.prices?.usd || 0
    }

    get isPriseLoading() {
        return !this.price
    }

    get txHumanReadable() {
        return {
            value: +ethers.utils.formatEther(this.txData.value),
            valueFiat: currencyFormat(+ethers.utils.formatEther(this.txData.value) * this.price),
            feeMax: this.transactionMaxFee,
            fee: this.transactionFee,
            feeFiat: currencyFormat(this.transactionFee * this.price),
            total: this.transactionTotalAmount,
            totalFiat: currencyFormat(+this.transactionTotalAmount * this.price),
            maxAmount: +ethers.utils.formatEther(this.txData.value) + this.transactionMaxFee
        }
    }

    get txBody() {
        return {
            chainId: this.txData.chainId,
            nonce: this.txData.nonce,
            gasPrice: this.txData.estimateGas,
            gasLimit: this.txData.estimateGasLimit,
            to: this.txData.to,
            from: this.txData.from,
            value: this.txData.value
        }
    }

    get diffBalanceTotal() {
        return +amountFormat(this.selectedWallet.ethBalance - this.transactionTotalAmount, 8)
    }

    get enoughBalance() {
        return this.diffBalanceTotal >= 0
    }

    /**
     * When user clicks on approve to connect with a dapp
     */
    onAccountsConfirm = () => {
        this.approvalRequest.resolve({ tx: this.txBody, meta: this.meta })
    }

    /**
     * When user clicks on reject to connect with a dapp
     */
    onAccountsRejected = () => {
        // this.clear()
        this.display = false
        this.approvalRequest.resolve(false)
    }

    clear() {
        this.txData = null
        this.txHash = null
        this.meta = null
    }
}
