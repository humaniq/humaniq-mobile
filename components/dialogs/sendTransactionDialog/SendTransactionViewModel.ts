import { makeAutoObservable } from "mobx"
import { getEthereumProvider, getWalletStore } from "../../../App"
import { BigNumber, ethers } from "ethers"
import { currencyFormat } from "../../../utils/number"
import { ERC20 } from "../../../store/wallet/erc20/ERC20";
import { getSnapshot } from "mobx-keystone";
import { Wallet } from "../../../store/wallet/Wallet";
import { inject } from "react-ioc";
import { SelectTransactionFeeDialogViewModel } from "../selectTransactionFeeDialog/SelectTransactionFeeDialogViewModel";

export class SendTransactionViewModel {
    display = false
    pending = false
    initialized = false
    sending = false
    symbol = "ETH"
    txHash = ""

    approvalRequest

    meta: {
        url: ""
    }

    txData = {
        data: undefined,
        chainId: 0,
        gasLimit: 21000,
        nonce: undefined,
        value: 0,
        to: "",
        from: ""
    }

    constructor() {
        makeAutoObservable(this)
    }

    transactionFeeView = inject(this, SelectTransactionFeeDialogViewModel)

    async init(txData, meta) {
        console.log(txData)
        try {
            this.pending = true
            this.meta = meta
            this.txData = {
                ...this.txData,
                ...txData
            }
            this.display = true
            this.initialized = true
            this.txData.chainId = getEthereumProvider().currentNetwork.chainID
            const [ nonce ] = await Promise.all([
                await getEthereumProvider().currentProvider.getTransactionCount(this.wallet.address, "pending"),
            ])
            this.txData.nonce = nonce
            this.txData.gasLimit = Number(txData.gas || txData.gasLimit) || this.txData.gasLimit
            this.transactionFeeView.wallet = this.wallet.address
            this.transactionFeeView.gasLimit = this.txData.gasLimit
            getEthereumProvider().gasStation.setEnableAutoUpdate(true)
            this.pending = false
        } catch (e) {
            console.log("ERROR", e)
        }
    }

    get selectedGasPrice() {
        return +getEthereumProvider().gasStation.selectedGasPrice
    }

    get selectedGasPriceLabel() {
        return getEthereumProvider().gasStation.selectedGasPriceLabel
    }

    get hostname() {
        return this.meta?.url ? new URL(this.meta.url).hostname : ""
    }

    get wallet(): Wallet {
        return getWalletStore().selectedWallet
    }

    get transactionMaxFee() {
        try {
            return this.txData.gasLimit ? +ethers.utils.formatEther((+this.selectedGasPrice * this.txData.gasLimit).toString()) : 0
        } catch (e) {
            console.log("ERROR", e)
            return 0
        }
    }

    get transactionFee() {
        return this.txData.gasLimit ? +ethers.utils.formatEther((+this.selectedGasPrice * this.txData.gasLimit).toString()) : 0
    }

    get transactionFiatFee() {
        return this.transactionFee * this.wallet?.prices[getWalletStore().currentFiatCurrency]
    }

    get transactionTotalAmount() {
        return this.txData.gasLimit ? +ethers.utils.formatEther(Number(this.txData.value).toString()) + this.transactionFee : 0
    }

    get price() {
        return this.wallet?.prices[getWalletStore().currentFiatCurrency] || 0
    }

    get parsedValue() {
        try {
            return +ethers.utils.formatEther(Number(this.txData.value).toString()) || "0"
        } catch (e) {
            return "0"
        }
    }

    get isPriseLoading() {
        return !this.price
    }

    get txHumanReadable() {
        try {
            return {
                value: this.parsedValue,
                valueFiat: this.parsedValue ? currencyFormat(+this.parsedValue * this.price, getWalletStore().currentFiatCurrency) : currencyFormat(0, getWalletStore().currentFiatCurrency),
                feeMax: this.transactionMaxFee,
                fee: this.transactionFee,
                feeFiat: currencyFormat(this.transactionFee * this.wallet?.prices[getWalletStore().currentFiatCurrency], getWalletStore().currentFiatCurrency),
                totalFiat: currencyFormat(+this.parsedValue * this.price + this.transactionFee * this.wallet?.prices[getWalletStore().currentFiatCurrency], getWalletStore().currentFiatCurrency),
                maxAmount: this.parsedValue ? (+this.parsedValue) + this.transactionMaxFee : 0,
                total: this.transactionTotalAmount
            }
        } catch (e) {
            console.log("ERROR", e)
            return {}
        }
    }

    get txBody() {
        try {
            return {
                chainId: this.txData.chainId.toString(),
                nonce: this.txData.nonce.toString(),
                gasPrice: this.selectedGasPrice.toString(),
                gas: this.txData.gasLimit.toString(),
                toAddress: this.txData.to,
                walletAddress: this.wallet.address,
                fromAddress: this.txData.from,
                value: this.txData.value.toString(),
                input: this.txData.data,
                blockTimestamp: new Date(),
                prices: this.token.prices,
                type: 0
            }
        } catch (e) {
            console.log("ERROR", e)
            return {}
        }
    }

    get enoughBalance() {
        return this.wallet.balances?.amount ? BigNumber.from(this.wallet.balances?.amount)
            .gt(BigNumber.from((+this.txData.value).toString()).add(
                    BigNumber.from((+this.selectedGasPrice * this.txData.gasLimit).toString())
                )
            ) : false
    }

    /**
     * When user clicks on approve to connect with a dapp
     */
    onAccountsConfirm = async () => {
        this.pending = true
        this.approvalRequest.resolve({ tx: this.txBody, meta: this.meta })
    }

    /**
     * When user clicks on reject to connect with a dapp
     */
    onAccountsRejected = () => {
        // this.clear()
        this.display = false
        this.approvalRequest.reject()
    }

    clear() {
        this.txData = null
        this.txHash = null
        this.meta = null
    }


    get token(): ERC20 | any {
        return {
            name: "Ethereum",
            symbol: "ETH",
            formatFiatBalance: this.wallet?.formatFiatBalance,
            formatBalance: this.wallet?.formatBalance,
            logo: "ethereum",
            fiatBalance: this.wallet?.fiatBalance,
            decimals: 18,
            priceUSD: this.wallet?.prices.usd,
            prices: getSnapshot(this.wallet?.prices)
        }
    }
}
