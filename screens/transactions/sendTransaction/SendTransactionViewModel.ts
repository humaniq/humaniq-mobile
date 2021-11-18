import { makeAutoObservable, reaction } from "mobx";
import { Wallet } from "../../../store/wallet/Wallet";
import { getEthereumProvider, getWalletStore } from "../../../App";
import { ERC20 } from "../../../store/wallet/erc20/ERC20";
import { inject } from "react-ioc";
import { SelectWalletTokenViewModel } from "../../../components/dialogs/selectWalletTokenDialog/SelectWalletTokenViewModel";
import { getSnapshot } from "mobx-keystone";
import { BigNumber, ethers } from "ethers";
import { currencyFormat } from "../../../utils/number";
import { EthereumTransaction, TRANSACTION_STATUS } from "../../../store/wallet/transaction/EthereumTransaction";
import { SelectTransactionFeeDialogViewModel } from "../../../components/dialogs/selectTransactionFeeDialog/SelectTransactionFeeDialogViewModel";
import { isValidAddress } from "ethereumjs-util/dist/account";
import { t } from "../../../i18n";
import { RootNavigation } from "../../../navigators";
import { CommonActions } from "@react-navigation/native";
import { contractAbiErc20 } from "../../../utils/abi";
import { ERC20Transaction } from "../../../store/wallet/transaction/ERC20Transaction";
import { throttle } from "../../../utils/general";

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
  contract

  betweenMyAddress = true

  txData = {
    chainId: 0,
    gasPrice: 0,
    nonce: "",
    value: "",
    to: "",
    gasLimit: 21000,
  }

  txError = false
  message = ""

  inputRef = null

  selectWalletTokenDialog = inject(this, SelectWalletTokenViewModel)
  selectTransactionFeeDialog = inject(this, SelectTransactionFeeDialogViewModel)

  changeTokenAddress = reaction(() => getSnapshot(this.selectWalletTokenDialog.tokenAddress), async (val) => {
    console.log({ val })
    this.txData.value = ""
    this.tokenAddress = val !== "ETH" ? val : ""
    this.inputFiat = false
    this.getTransactionData()
    if (this.tokenAddress && !this.wallet.erc20TransactionsInitialized) {
      this.wallet.getERC20Transactions()
    } else if (!this.wallet.transactions.initialized) {
      this.wallet.loadTransactions()
    }
    // setTimeout(() => {
    //   try {
    //     this.inputRef?.current?.focus()
    //   } catch (e) {
    //     console.log(e)
    //   }
    // }, 100)
  })

  changeReceiverAddress = reaction(() => this.txData.to, (val) => {
    this.txData.to = val
    this.inputFiat = false
    this.getTransactionData()
    // setTimeout(() => {
    //   try {
    //     this.inputRef?.current?.focus()
    //   } catch (e) {
    //     console.log(e)
    //   }
    // }, 100)
  })

  changeTokenValue = reaction(() => this.txData.value, throttle(async () => {
    try {
      this.txData.gasLimit = this.tokenAddress && this.txData.to ? +((await this.contract.estimateGas.transfer(this.txData.to, ethers.utils.parseUnits(this.parsedValue.toString(), this.token.decimals))).toString()) : 21000
    } catch (e) {
      console.log("ERROR-estimate-gas", e)
    }
  }, 200))

  get wallet(): Wallet {
    return getWalletStore().walletsMap.get(this.walletAddress)
  }


  get selectedGasPrice() {
    return +(this.txData.gasPrice * this.selectTransactionFeeDialog.selected).toFixed(0)
  }

  async init(route) {
    this.tokenAddress = route?.tokenAddress
    this.walletAddress = route?.walletAddress
    if (!this.initialized) {
      await this.getTransactionData();

      if (this.tokenAddress) {
        this.wallet.getERC20Transactions()
      } else {
        this.wallet.loadTransactions(true)
      }
      this.initialized = true
    }
  }

  registerInput(inputRef) {
    this.inputRef = inputRef
  }

  async getTransactionData() {
    try {
      this.pending = true
      this.txData.chainId = getEthereumProvider().currentNetwork.chainID
      if (this.tokenAddress) {
        this.contract = new ethers.Contract(this.tokenAddress, contractAbiErc20, this.wallet.ether);
      }

      const [ nonce, gasPrice, gasLimit ] = await Promise.all([
        getEthereumProvider().currentProvider.getTransactionCount(this.wallet.address, "pending"),
        getEthereumProvider().currentProvider.getGasPrice(),
        this.tokenAddress && this.txData.to && this.contract.estimateGas.transfer(this.txData.to, ethers.utils.parseUnits(this.parsedValue.toString(), this.token.decimals))
      ])
      console.log({ gasLimit: gasLimit && gasLimit.toString() })
      this.txData.nonce = nonce
      this.txData.gasPrice = gasPrice.toString()
      this.txData.gasLimit = gasLimit && +(gasLimit.toString()) || 21000
      this.pending = false
      console.log(this.txData, this.parsedValue, ethers.utils.parseUnits(this.parsedValue.toString(), this.token.decimals))
    } catch (e) {
      console.log("ERROR-get-transaction-data", e)
    }
  }

  setMaxValue() {
    try {
      if (this.token.symbol === "ETH") {
        this.txData.value = this.inputFiat ? ((this.wallet.valBalance - this.transactionFee) * this.price).toFixed(2).toString() : (this.wallet.valBalance - this.transactionFee).toFixed(6).toString()
      } else {
        this.txData.value = this.inputFiat ? (this.token.valBalance * this.price).toFixed(2).toString() : this.token.valBalance.toFixed(6).toString()
      }
    } catch (e) {
      console.log("ERROR", e)
    }
  }

  get price() {
    return this.token.priceUSD
  }

  get transactionMaxFee() {
    try {
      return this.txData.gasPrice ? +ethers.utils.formatUnits(+this.selectedGasPrice * this.txData.gasLimit, 18) : 0
    } catch (e) {
      console.log("ERROR", e)
      return 0
    }
  }

  get transactionFee() {
    try {
      return this.txData.gasPrice ? +ethers.utils.formatUnits(+this.selectedGasPrice * this.txData.gasLimit, 18) : 0
    } catch (e) {
      console.log("ERROR", e)
      return 0
    }
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
    try {
      return Number(this.txData.value) ? this.inputFiat ? (Number(this.txData.value) / this.price).toFixed(6).toString() : (Number(this.txData.value) * this.price).toFixed(2).toString() : "0"
    } catch (e) {
      console.log("ERROR", e)
      return 0
    }
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
      maxAmount: this.parsedValue ? (+this.parsedValue) + this.transactionMaxFee : 0,
      total: this.token.symbol === "ETH" ? `${ (+this.transactionFee + (+this.parsedValue)) } ETH` :
          `${ this.parsedValue } ${ this.token.symbol } + ${ this.transactionFee } ETH`
    }
  }

  get enoughBalance() {
    try {
      if (this.token.symbol === "ETH") {
        return BigNumber.from(this.wallet.balances.amount)
            .gt(ethers.utils.parseUnits(this.parsedValue.toString(), this.token.decimals).add(
                    BigNumber.from(this.txData.gasLimit * +this.selectedGasPrice)
                )
            )
      } else {
        return BigNumber.from(this.token.balance)
                .gt(ethers.utils.parseUnits(this.parsedValue.toString(), this.token.decimals)) &&
            BigNumber.from(this.wallet.balances.amount)
                .gt(BigNumber.from(this.txData.gasLimit * +this.selectedGasPrice))
      }
    } catch (e) {
      console.log("ERROR-enough-balance", e)
      return false
    }
  }

  get inputAddressError() {
    return this.txData.to && !isValidAddress(this.txData.to)
  }

  get inputAddressErrorMessage() {
    return this.inputAddressError ?
        t("selectAddressScreen.inputMessageError") :
        !this.txData.to ? t("selectAddressScreen.inputMessage") : ""
  }

  get isTransferAllow() {
    try {
      return !(!this.wallet?.balances.amount || !this.parsedValue || !this.enoughBalance);
    } catch (e) {
      console.log(e)
      return false
    }
  }

  get txBody() {
    const baseBody = {
      chainId: this.txData.chainId.toString(),
      nonce: this.txData.nonce.toString(),
      gasPrice: this.selectedGasPrice.toString(),
      gas: this.txData.gasLimit.toString(),
      value: ethers.utils.parseUnits(this.parsedValue.toString(), this.token.decimals).toString(), // this.txBody.value.toString(),
      walletAddress: this.wallet.address,
      toAddress: this.txData.to,
      fromAddress: this.wallet?.address,
      input: "0x",
      blockTimestamp: new Date(),
      prices: !this.tokenAddress ? {
        usd: this.token.prices?.usd,
        eur: this.token.prices?.eur
      } : { usd: this.token.priceUSD },
      type: 0
    }
    return !this.tokenAddress ? baseBody : {
      ...baseBody,
      decimals: this.token.decimals,
      address: this.tokenAddress,
      symbol: this.token.symbol,
      receiptStatus: TRANSACTION_STATUS.PENDING
    }
  }

  sendTx = async () => {
    try {
      if (this.pendingTransaction) return

      setTimeout(() => {
        this.pendingTransaction = true
      }, 10)

      const tx = !this.tokenAddress ?
          new EthereumTransaction(this.txBody) :
          new ERC20Transaction(this.txBody)
      await tx.sendTransaction()
      tx.applyToWallet()
      setTimeout(() => {
        tx.waitTransaction()
        this.closeDialog()
      }, 10)

      RootNavigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: "walletsList",
              },
              {
                name: "walletTransactions",
                params: {
                  wallet: this.wallet.address,
                  tokenAddress: this.tokenAddress,
                  initialized: true
                }
              }
            ]
          })
      )

      this.pendingTransaction = false
    } catch (e) {
      this.txError = true
      console.log("ERROR-send-tx", e)
      this.pendingTransaction = false
    }
  }

  closeDialog = () => {
    // if (this.pendingTransaction) return
    this.initialized = false
    this.txData = {
      chainId: 0,
      gasLimit: 0,
      gasPrice: 0,
      nonce: "",
      value: "",
      to: "",
    }
    // this.pendingTransaction = false
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
          priceUSD: this.wallet?.prices.usd,
          prices: this.wallet?.prices
        }
  }

  constructor() {
    makeAutoObservable(this, null, { autoBind: true })
  }
}