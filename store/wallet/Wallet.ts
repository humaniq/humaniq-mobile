import { _await, Model, model, modelFlow, objectMap, runUnprotected, tProp as p, types as t } from "mobx-keystone"
import { ethers, Signer } from "ethers"
import { computed, observable } from "mobx"
import { amountFormat, beautifyNumber, currencyFormat, preciseRound } from "../../utils/number"
import uuid from "react-native-uuid"
import { COINGECKO_ROUTES, MORALIS_ROUTES, ROUTES } from "../../config/api"
import { formatRoute } from "../../navigators"
import { getEthereumProvider, getMoralisRequest, getRequest } from "../../App"
import { EthereumTransaction } from "./transaction/EthereumTransaction"
import { intToHex } from "ethjs-util"
import { changeCaseObj } from "../../utils/general"
import { ERC20 } from "./erc20/ERC20"
import { ERC20Transaction } from "./transaction/ERC20Transaction";

export interface TransactionsRequestResult {
  page: number,
  page_size: number
  total: number
  result: Array<any>
}

@model("Wallet")
export class Wallet extends Model({
  isError: p(t.boolean, false),
  pending: p(t.boolean, false),
  initialized: p(t.string, ""),
  address: p(t.string, ""),
  name: p(t.string, ""),
  balance: p(t.string, "0"),
  mnemonic: p(t.string, ""),
  path: p(t.string, ""),
  hdPath: p(t.string, ""),
  privateKey: p(t.string),
  publicKey: p(t.string),
  balances: p(t.maybeNull(t.object(() => ({
    // Address: t.string,
    amount: t.number,
    amountUnconfirmed: t.number,
    recomendedFee: t.number
    // Transactions: t.maybeNull(t.)
  })))),
  prices: p(t.maybeNull(t.object(() => ({
    eur: t.number,
    usd: t.number
  })))),
  transactions: p(t.objectMap(t.model<EthereumTransaction>(EthereumTransaction)), () => objectMap<EthereumTransaction>()),
  erc20: p(t.objectMap(t.model<ERC20>(ERC20)), () => objectMap<ERC20>())
}) {

  @observable
  ether: Signer

  @modelFlow
  * init(force = false) {
    if (!this.initialized || force) {
      try {
        this.pending = true
        this.ether = new ethers.Wallet(this.privateKey, getEthereumProvider().currentProvider) // root.providerStore.eth.currenProvider || undefined);

        yield Promise.all([
          this.updateBalanceFromProvider(),
          // this.updateBalanceFromApi(),
          this.getCoinCost(),
          this.getErc20Balances()
        ])
      } catch (e) {
        console.log("ERROR", e)
        this.isError = true
      } finally {
        this.initialized = uuid.v4()
        this.pending = false
      }
    }
  }

  @modelFlow
  * updateBalanceFromProvider() {
    try {
      const bn = yield* _await(this.ether.getBalance())
      this.balance = this.isConnected ? bn.toString() : this.balance
      this.balances = {
        amount: this.isConnected ? bn.toString() : this.balances.amount,
        amountUnconfirmed: 0,
        recomendedFee: 0
      }
    } catch (e) {
      console.log("ERROR", e)
      this.isError = true
    }
  }

  @modelFlow
  * updateBalanceFromApi() {
    const balances = yield getRequest().get(formatRoute(ROUTES.PRICES.GET_BALANCES_FOR_WALLET, {
      node: "eth",
      address: this.address
    }))
    if (balances.ok) {
      this.balances = balances.data.item
    } else {
      this.isError = true
    }
  }

  @modelFlow
  * getCoinCost() {
    const cost = yield getRequest().get(COINGECKO_ROUTES.GET_TOKEN_PRICE, {
      ids: "ethereum",
      vs_currencies: "usd,eur"
    })
    if (cost.ok) {
      this.prices = cost.data.ethereum
    } else {
      this.isError = true
    }
  }

  @modelFlow
  * getWalletTransactions() {
    const route = formatRoute(MORALIS_ROUTES.ACCOUNT.GET_TRANSACTIONS, {
      address: this.address
    })
    const chain = intToHex(getEthereumProvider().currentNetwork.chainID)
    const result = yield getMoralisRequest().get(route, { chain })
    if (result.ok && (result.data as TransactionsRequestResult).total) {
      (result.data as TransactionsRequestResult).result.forEach(r => {

        const tr = new EthereumTransaction({
          ...changeCaseObj(r),
          chainId: getEthereumProvider().currentNetwork.chainID,
          walletAddress: this.address.toLowerCase(),
          blockTimestamp: new Date(r.block_timestamp),
          prices: {
            usd: this.prices?.usd,
            eur: this.prices?.eur
          }
        })
        runUnprotected(() => {
          this.transactions.set(tr.nonce, tr)
        })
      })
    }
  }

  @modelFlow
  * getERC20Transactions() {
    const route = formatRoute(MORALIS_ROUTES.ACCOUNT.GET_ERC20_TRANSFERS, {
      address: this.address
    })
    const chain = intToHex(getEthereumProvider().currentNetwork.chainID)
    const result = yield getMoralisRequest().get(route, { chain })

    if (result.ok && (result.data as TransactionsRequestResult).total) {
      (result.data as TransactionsRequestResult).result.forEach(r => {

        const currentToken = this.erc20.get(r.address)

        const tr = new ERC20Transaction({
          ...changeCaseObj(r),
          symbol: currentToken.symbol,
          decimals: currentToken.decimals,
          chainId: getEthereumProvider().currentNetwork.chainID,
          walletAddress: this.address.toLowerCase(),
          blockTimestamp: new Date(r.block_timestamp),
          prices: {
            usd: currentToken.priceUSD,
          }
        })
        if (currentToken) {
          runUnprotected(() => {
            currentToken.transactions.set(tr.transactionHash, tr)
          })
        }
      })
    }
  }

  @modelFlow
  * getErc20Balances() {

    const route = formatRoute(MORALIS_ROUTES.ACCOUNT.GET_ERC20_BALANCES, {
      address: this.address
    })
    const chain = intToHex(getEthereumProvider().currentNetwork.chainID)
    const erc20 = yield getMoralisRequest().get(route, { chain })
    if (erc20.ok) {
      erc20.data.forEach(t => {
        const erc20Token = new ERC20({ ...changeCaseObj(t), walletAddress: this.address })
        this.erc20.set(t.token_address, erc20Token)
        erc20Token.init()
      })
    } else {
      console.log("ERROR-GET-ERC20")
    }
  }

  @computed
  get pendingTransaction() {
    return Object.values<EthereumTransaction>(this.transactions).find(t => !t.receiptStatus)
  }

  @computed
  get isConnected() {
    return !!this.ether.provider
  }

  @computed
  get erc20List() {
    return Object.values<ERC20>(this.erc20.items)
  }

  @computed
  get transactionsList() {
    return Object.values<EthereumTransaction>(this.transactions.items).sort((a, b) => b.blockTimestamp - a.blockTimestamp)
  }

  @computed
  get formatAddress() {
    return this.address ? `${ this.address.slice(0, 4) }...${ this.address.substring(this.address.length - 4) }` : ""
  }

  @computed
  get valBalance() {
    return this?.balances?.amount ? preciseRound(+ethers.utils.formatEther(ethers.BigNumber.from(this.balances.amount.toString()))) : 0
  }

  @computed
  get formatBalance() {
    return amountFormat(this.valBalance, 8)
  }

  @computed
  get fiatBalance() {
    return this.prices?.usd ? preciseRound(this?.prices?.usd * this.valBalance) : 0
  }

  @computed
  get formatFiatBalance() {
    return this.fiatBalance ? `$${ beautifyNumber(+this.fiatBalance) }` : `--/--`
  }

  @computed
  get totalWalletFiatBalance() {
    return this.fiatBalance + this.erc20List.reduce((acc, item) => {
      acc += item.fiatBalance
      return acc
    }, 0)
  }

  @computed
  get formatTotalWalletFiatBalance() {
    return currencyFormat(+this.totalWalletFiatBalance)
  }
}
