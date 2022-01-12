import { makeAutoObservable } from "mobx"
import { getEthereumProvider, getWalletStore } from "../../../App"
import { BigNumber, ethers } from "ethers"
import { currencyFormat } from "../../../utils/number"

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
    gasPrice: 0,
    gasLimit: 21000,
    nonce: undefined,
    value: 0,
    to: "",
    from: ""
  }

  constructor() {
    makeAutoObservable(this)
  }

  async init(txData, meta) {
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
      const [ nonce, gasPrice ] = await Promise.all([
        await getEthereumProvider().currentProvider.getTransactionCount(this.selectedWallet.address, "pending"),
        await getEthereumProvider().currentProvider.getGasPrice()
      ])
      this.txData.nonce = nonce
      this.txData.gasLimit = Number(txData.gas)
      this.txData.gasPrice = gasPrice && +(gasPrice.toString())
      this.pending = false
    } catch (e) {
      console.log("ERROR", e)
    }
  }

  get hostname() {
    return this.meta?.url ? new URL(this.meta.url).hostname : ""
  }

  get selectedWallet() {
    return getWalletStore().selectedWallet
  }

  get transactionMaxFee() {
    try {
      return this.txData.gasLimit ? +ethers.utils.formatEther((this.txData.gasLimit * this.txData.gasPrice).toString()) : 0
    } catch (e) {
      console.log("ERROR", e)
      return 0
    }
  }

  get transactionFee() {
    return this.txData.gasLimit ? +ethers.utils.formatEther((this.txData.gasLimit * this.txData.gasPrice).toString()) : 0
  }

  get transactionTotalAmount() {
    return this.txData.gasLimit ? +ethers.utils.formatEther(Number(this.txData.value).toString()) + this.transactionFee : 0
  }

  get price() {
    return getWalletStore().selectedWallet.prices?.usd || 0
  }

  get isPriseLoading() {
    return !this.price
  }

  get txHumanReadable() {
    try {
      return {
        value: +ethers.utils.formatEther(Number(this.txData.value).toString()),
        valueFiat: currencyFormat(+ethers.utils.formatEther(Number(this.txData.value).toString()) * this.price),
        feeMax: this.transactionMaxFee,
        fee: this.transactionFee,
        feeFiat: currencyFormat(this.transactionFee * this.price),
        total: this.transactionTotalAmount,
        totalFiat: currencyFormat(+this.transactionTotalAmount * this.price),
        maxAmount: +ethers.utils.formatEther(Number(this.txData.value).toString()) + this.transactionMaxFee,
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
        gasPrice: this.txData.gasPrice.toString(),
        gas: this.txData.gasLimit.toString(),
        toAddress: this.txData.to,
        walletAddress: this.selectedWallet.address,
        fromAddress: this.txData.from,
        value: this.txData.value.toString(),
        input: this.txData.data,
        blockTimestamp: new Date(),
        prices: {
          usd: this.price
        },
        type: 0
      }
    } catch (e) {
      console.log("ERROR", e)
      return {}
    }
  }

  get enoughBalance() {
    return this.selectedWallet.balances?.amount ? BigNumber.from(this.selectedWallet.balances?.amount)
        .gt(BigNumber.from((+this.txData.value).toString()).add(
                BigNumber.from((this.txData.gasLimit * +this.txData.gasPrice).toString())
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
}
