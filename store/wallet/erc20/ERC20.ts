import { Model, model, prop, runUnprotected } from "mobx-keystone"
import { formatUnits } from "ethers/lib/utils"
import { beautifyNumber, preciseRound } from "../../../utils/number"
import { action, computed } from "mobx"
import { getEthereumProvider, getMoralisRequest } from "../../../App";
import { MORALIS_ROUTES } from "../../../config/api";
import { formatRoute } from "../../../navigators";
import { intToHex } from "ethjs-util";


@model("ERC20")
export class ERC20 extends Model({
  initialized: prop<boolean>(false),
  fiatBalance: prop<number>(0),
  pending: prop<boolean>(false),
  tokenAddress: prop<string>(""),
  name: prop<string>(""),
  symbol: prop<string>(""),
  logo: prop<string>(""),
  thumbnail: prop<string>(""),
  decimals: prop<string>(""),
  balance: prop<string>("")
}) {

  @action
  async init() {
    // const result = await getMoralisRequest().get(formatRoute(MORALIS_ROUTES.TOKEN.GET_ERC20_PRICE, {
    //   address: this.tokenAddress
    // }), {
    //   chain: intToHex(getEthereumProvider().currentNetwork.chainID)
    // })
    // console.log(result)
    // runUnprotected(() => {
    //   this.initialized = true
    //   this.fiatBalance = 20
    // })
  }

  @computed
  get valBalance() {
    return preciseRound(+formatUnits(this.balance, this.decimals).toString())
  }

  @computed
  get formatBalance() {
    return beautifyNumber(this.valBalance)
  }
}
