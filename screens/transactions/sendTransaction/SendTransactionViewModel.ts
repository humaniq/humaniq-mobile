import { makeAutoObservable, reaction } from "mobx";
import { Wallet } from "../../../store/wallet/Wallet";
import { getEthereumProvider, getWalletStore } from "../../../App";
import { ERC20 } from "../../../store/wallet/erc20/ERC20";
import { inject } from "react-ioc";
import { SelectWalletTokenViewModel } from "../../../components/dialogs/selectWalletTokenDialog/SelectWalletTokenViewModel";
import { getSnapshot, runUnprotected } from "mobx-keystone";
import { BigNumber, ethers } from "ethers";
import { amountFormat, currencyFormat } from "../../../utils/number";
import { EthereumTransaction } from "../../../store/wallet/transaction/EthereumTransaction";
import { SelectTransactionFeeDialogViewModel } from "../../../components/dialogs/selectTransactionFeeDialog/SelectTransactionFeeDialogViewModel";

export class SendTransactionViewModel {

  display = false
  pending = false
  pendingTransaction = false
  initialized = false
  walletAddress = ""
  tokenAddress = ""
  symbol = "ETH"
  commissionSelectExpanded = false
  inputFiat = false

  txData = {
    chainId: 0,
    gas: 0,
    gasPrice: 0,
    nonce: "",
    value: "",
    to: "",
    estimateGas: "",
  }

  txError = false
  message = ""

  inputRef = null

  selectWalletTokenDialog = inject(this, SelectWalletTokenViewModel)
  selectTransactionFeeDialog = inject(this, SelectTransactionFeeDialogViewModel)

  changeTokenAddress = reaction(() => getSnapshot(this.selectWalletTokenDialog.tokenAddress), async (val) => {
    this.closeDialog()
    this.tokenAddress = val
    this.inputFiat = false
    this.getTransactionData()
    setTimeout(() => {
      this.inputRef.current?.focus()
    }, 100)
  })

  get wallet(): Wallet {
    return getWalletStore().allWallets.find(w => w.address === this.walletAddress)
  }

  get estimateGasLimit() {
    return 21000 * this.selectTransactionFeeDialog.selected
  }

  init(route) {
    this.tokenAddress = route?.tokenAddress
    this.walletAddress = route?.walletAddress
    this.getTransactionData()
  }

  registerInput(inputRef) {
    this.inputRef = inputRef
  }

  async getTransactionData() {
    this.pending = true
    this.txData.chainId = getEthereumProvider().currentNetwork.chainID
    const [ nonce, estimateGas ] = await Promise.all([
      await getEthereumProvider().currentProvider.getTransactionCount(this.wallet.address, "pending"),
      await getEthereumProvider().currentProvider.getGasPrice(),
    ])
    this.txData.nonce = nonce
    this.txData.estimateGas = estimateGas.toString()
    this.pending = false
  }

  setMaxValue() {
    if (this.token.symbol === "ETH") {
      this.txData.value = this.inputFiat ? ((this.wallet.valBalance - this.transactionFee) * this.price).toFixed(2).toString() : (this.wallet.valBalance - this.transactionFee).toFixed(6).toString()
    } else {
      this.txData.value = this.inputFiat ? (this.token.valBalance * this.price).toFixed(2).toString() : this.token.valBalance.toFixed(6).toString()
    }
  }

  get price() {
    return this.token.priceUSD
  }

  get transactionMaxFee() {
    return this.txData.gasPrice ? +ethers.utils.formatUnits(this.txData.gasPrice * this.txData.gas, 18) : 0
  }

  get transactionFee() {
    return this.txData.estimateGas ? +ethers.utils.formatUnits(+this.txData.estimateGas * this.estimateGasLimit, 18) : 0
  }

  get transactionFiatFee() {
    return this.transactionFee * this.wallet?.prices.usd
  }

  get parsedValue() {
    try {
      return Number(this.txData.value) ? this.inputFiat ? (Number(this.txData.value) / this.price).toFixed(6).toString() : Number(this.txData.value).toString() : "0"
    } catch (e) {
      return "0"
    }
  }

  get parsedPrice() {
    return Number(this.txData.value) ? this.inputFiat ? (Number(this.txData.value) / this.price).toFixed(6).toString() : (Number(this.txData.value) * this.price).toFixed(2).toString() : "0"
  }

  swapInputType() {
    if (this.isSwapEnable) {
      this.txData.value = Number(this.parsedPrice).toFixed(this.inputFiat ? 6 : 2).toString()
      this.inputFiat = !this.inputFiat
    }
  }

  get txHumanReadable() {
    return {
      value: this.parsedValue,
      valueFiat: this.parsedValue ? currencyFormat(+this.parsedValue * this.price) : currencyFormat(0),
      feeMax: this.transactionMaxFee,
      fee: this.transactionFee,
      feeFiat: currencyFormat(this.transactionFee * this.wallet?.prices.usd),
      totalFiat: currencyFormat(+this.parsedValue * this.price + this.transactionFee * this.wallet?.prices.usd),
      maxAmount: this.parsedValue ? +this.parsedValue + this.transactionMaxFee : 0
    }
  }

  get enoughBalance() {
    if (this.token.symbol === "ETH") {
      return +amountFormat(this.wallet.valBalance - (this.txData.estimateGas && this.parsedValue ? +this.parsedValue + this.transactionFee : 0), 8) >= 0
    } else {
      return this.token.valBalance - (+this.parsedValue) >= 0 && this.wallet.valBalance - (this.txData.estimateGas ? this.transactionFee : 0) >= 0
    }
  }

  get txBody() {
    return {
      chainId: this.txData.chainId,
      nonce: this.txData.nonce,
      gasPrice: this.txData.estimateGas,
      gasLimit: this.estimateGasLimit,
      to: this.txData.to,
      from: this.wallet?.address,
      value: ethers.utils.parseUnits(this.parsedValue.toString(), this.token.decimals),
    }
  }

  get isTransferAllow() {
    try {
      if (!this.wallet?.balances.amount || !this.parsedValue || !this.enoughBalance) return false
      return BigNumber.from(this.wallet.balances.amount)
          .gt(ethers.utils.parseUnits(this.parsedValue.toString(), this.token.decimals).add(
                  BigNumber.from(this.estimateGasLimit * this.txData.gasPrice)
              )
          )
    } catch (e) {
      console.log(e)
      return false
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
        // this.ethTransactionToast.transaction = etx
      })
      this.pendingTransaction = false
      // this.closeDialog()
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
      value: "",
      to: "",
      estimateGas: "",
    }
    this.pendingTransaction = false
    this.display = false
  }

  get inputTitle() {
    return this.inputFiat ? "USD" : this.token.symbol
  }

  get inputPrice() {
    return this.inputFiat ? this.token.symbol : "USD"
  }

  get isSwapEnable() {
    return this.token?.fiatBalance !== null
  }

  get token(): ERC20 | any {
    return this.tokenAddress
        ? this.wallet.erc20List.find(t => t.tokenAddress === this.tokenAddress) : {
          name: "Ethereum",
          symbol: "ETH",
          formatFiatBalance: this.wallet?.formatFiatBalance,
          formatBalance: this.wallet?.formatBalance,
          logo: "ethereum",
          fiatBalance: this.wallet?.fiatBalance,
          decimals: 18,
          priceUSD: this.wallet?.prices.usd
        }
  }

  constructor() {
    makeAutoObservable(this, null, { autoBind: true })
  }
}