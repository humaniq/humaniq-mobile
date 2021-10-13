import { Model, model, objectMap, prop, runUnprotected, tProp as p, types as t } from "mobx-keystone"
import { formatUnits } from "ethers/lib/utils"
import { beautifyNumber, preciseRound } from "../../../utils/number"
import { action, computed } from "mobx"
import { getDictionary, getMoralisRequest } from "../../../App";
import { MORALIS_ROUTES } from "../../../config/api";
import { formatRoute } from "../../../navigators";
import { ERC20Transaction } from "../transaction/ERC20Transaction";


@model("ERC20")
export class ERC20 extends Model({
  walletAddress: p(t.string, ""),
  initialized: prop<boolean>(false),
  pending: prop<boolean>(false),
  tokenAddress: prop<string>(""),
  name: prop<string>(""),
  symbol: prop<string>(""),
  logo: prop<string>(""),
  thumbnail: prop<string>(""),
  decimals: prop<string>(""),
  balance: prop<string>(""),
  priceUSD: prop<string>(""),
  priceEther: prop<string>(""),
  transactions: p(t.objectMap(t.model<ERC20Transaction>(ERC20Transaction)), () => objectMap<ERC20Transaction>())
}) {

  @action
  async init() {
    try {
      const address = getDictionary().ethToken.get(this.symbol)?.address
      if (address) {
        const result = await getMoralisRequest().get(formatRoute(MORALIS_ROUTES.TOKEN.GET_ERC20_PRICE, { address }), {
          chain: 'eth'
        })
        if (result.ok) {
          runUnprotected(() => {
            this.priceUSD = result.data.usdPrice
            getDictionary().ethTokenCurrentAddress.set(this.tokenAddress, this.symbol)
          })
        }
      }
    } catch (e) {
      console.log("ERROR", e)
    } finally {
      runUnprotected(() => {
        this.initialized = true
      })
    }
  }

  @computed
  get transactionsList() {
    return Object.values<ERC20Transaction>(this.transactions.items).sort((a, b) => b.blockTimestamp - a.blockTimestamp)
  }

  @computed
  get valBalance() {
    return preciseRound(+formatUnits(this.balance, this.decimals).toString())
  }

  @computed
  get formatBalance() {
    return this.valBalance ? beautifyNumber(this.valBalance) : `--/--`
  }

  @computed
  get fiatBalance() {
    return this.priceUSD ? preciseRound(this.valBalance * this.priceUSD) : 0
  }

  @computed
  get formatFiatBalance() {
    return this.fiatBalance ? `≈$${ beautifyNumber(+this.fiatBalance) }` : `--/--`
  }
}
