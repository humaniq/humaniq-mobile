import { getEthereumProvider, getMoralisRequest, getWalletStore } from "../../../../App"
import { makeAutoObservable } from "mobx"
import { MORALIS_ROUTES } from "../../../../config/api"
import { formatRoute } from "../../../../navigators"
import { intToHex } from "ethjs-util"
import { EthereumTransaction } from "../../../../store/transaction/EthereumTransaction"
import { changeCaseObj } from "../../../../utils/general"
import { runUnprotected } from "mobx-keystone"

interface RequestResult {
    page: number,
    page_size: number
    total: number
    result: Array<any>
}

export class TransactionsScreenViewModel {
    initialized = false
    currentWalletAddress
    refreshing = false

    get wallet() {
        return getWalletStore().allWallets.find(w => w.address === this.currentWalletAddress)
    }

    async init(params) {
        try {
            this.currentWalletAddress = params.wallet
            const route = formatRoute(MORALIS_ROUTES.ACCOUNT.GET_TRANSACTIONS, {
                address: this.currentWalletAddress
            })
            const chain = intToHex(getEthereumProvider().currentNetwork.chainID)
            const result = await getMoralisRequest().get(route, { chain })
            if (result.ok && (result.data as RequestResult).total) {
                (result.data as RequestResult).result.forEach(r => {
                    const tr = new EthereumTransaction({
                        ...changeCaseObj(r),
                        chainId: getEthereumProvider().currentNetwork.chainID,
                        walletAddress: this.wallet.address.toLowerCase(),
                        blockTimestamp: new Date(r.block_timestamp)
                    })
                    runUnprotected(() => {
                        this.wallet.transactions.set(tr.nonce, tr)
                    })
                })
            }
            this.initialized = true
        } catch (e) {
            console.log("ERROR", e)
        }

    }

    constructor() {
        makeAutoObservable(this, null, { autoBind: true })
    }
}
