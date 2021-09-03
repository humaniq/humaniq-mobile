import { makeAutoObservable, reaction } from "mobx"
import { MutableRefObject } from "react"
import { DAPPS_CONFIG } from "../../config/dapp"
import { getUrlObj } from "../../utils/browser"
import { getAppStore, getEthereumProvider, getWalletStore } from "../../App"
// import { createAsyncMiddleware, JsonRpcRequest, PendingJsonRpcResponse } from "json-rpc-engine"
import { NavigationProp } from "@react-navigation/native"
// import BackgroundBridge from "../../core/BackgroundBridge"
import { dappsProvider } from "../../utils/DappsProvider"
import { getSnapshot } from "mobx-keystone"
import { JS_POST_MESSAGE_TO_PROVIDER, SET_NETWORK_ID } from "../../utils/browserScripts"
import { inject } from "react-ioc"
import { ApprovalDappConnectDialogViewModel } from "../../components/dialogs/approvalDappConnectDialog/ApprovalDappConnectDialogViewModel"
import { resemblesAddress } from "../../utils/address"
import { ethErrors } from 'eth-json-rpc-errors'

export class BrowserScreenViewModel {

    navigation: NavigationProp<any>
    initialized = false
    backEnabled = false
    forwardEnabled = false
    progress = 0
    initialUrl = "https://metamask.github.io/test-dapp/" // 'https://app.uniswap.org/' //  'https://metamask.github.io/test-dapp/' // 'https://dap.ps' //
    firstUrlLoaded = false
    autocompleteValue = ''
    error = null
    showUrlModal = false
    showOptions = false
    entryScriptWeb3 = null
    showApprovalDialog = false
    showApprovalDialogHostname = false
    showPhishingModal = false
    blockedUrl = undefined
    watchAsset = false
    suggestedAssetMeta = undefined
    customNetworkToAdd = null
    showAddCustomNetworkDialog = false
    customNetworkToSwitch = null
    showSwitchCustomNetworkDialog = undefined

    webviewRef: any
    inputRef: MutableRefObject<any>

    url = ""
    title = ""
    icon = ""

    webviewUrlPostMessagePromiseResolve = null
    backgroundBridges: Array<any>
    approvalRequest = null
    fromHomepage = false
    addCustomNetworkRequest = null
    switchCustomNetworkRequest = null
    sessionENSNames = new Map()
    ensIgnoreList = []
    approvedHosts = new Set()
    appVersion: string
    reload

    approvalDialog = inject(this, ApprovalDappConnectDialogViewModel)

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    async init(nav: NavigationProp<any>) {
        this.navigation = nav
        this.initialized = true
        const entryScriptWeb3 = await dappsProvider.get()
        this.entryScriptWeb3 = SET_NETWORK_ID(getEthereumProvider().currentNetwork.networkID) + entryScriptWeb3

        reaction(() => getSnapshot(getEthereumProvider().currentNetworkName), () => {
            this.reloadWebView()
        })

        reaction(() => getSnapshot(getWalletStore().selectedWallet.address), () => {
            this.reloadWebView()
        })
    }

    reloadWebView() {
        try {
            this.webviewRef.reload()
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * Gets the url to be displayed to the user
     * For example, if it's ens then show [site].eth instead of ipfs url
     */
    getMaskedUrl(url: string) {
        if (!url) return url
        let replace = null
        if (url.startsWith(DAPPS_CONFIG.IPFS_DEFAULT_GATEWAY_URL)) {
            replace = key => `${ DAPPS_CONFIG.IPFS_DEFAULT_GATEWAY_URL }${ this.sessionENSNames[key].hash }/`
        } else if (url.startsWith(DAPPS_CONFIG.IPNS_DEFAULT_GATEWAY_URL)) {
            replace = key => `${ DAPPS_CONFIG.IPNS_DEFAULT_GATEWAY_URL }${ this.sessionENSNames[key].hostname }/`
        } else if (url.startsWith(DAPPS_CONFIG.SWARM_DEFAULT_GATEWAY_URL)) {
            replace = key => `${ DAPPS_CONFIG.SWARM_GATEWAY_URL }${ this.sessionENSNames[key].hash }/`
        }

        if (replace) {
            const key = Object.keys(this.sessionENSNames).find(ens => url.startsWith(ens))
            if (key) {
                url = url.replace(replace(key), `https://${ this.sessionENSNames[key].hostname }/`)
            }
        }

        return url
    }

    toggleUrlModal({ urlInput = null } = {}) {
        const goingToShow = !this.showUrlModal
        const urlToShow = this.getMaskedUrl(urlInput || this.url)
        if (goingToShow && urlToShow) this.autocompleteValue = urlToShow
        this.showUrlModal = goingToShow
    }

    /**
     * Checks if it is a ENS website
     */
    isENSUrl(url) {
        const { hostname } = new URL(url)
        const tld = hostname.split('.').pop()
        if (DAPPS_CONFIG.supportedTLDs.indexOf(tld.toLowerCase()) !== -1) {
            // Make sure it's not in the ignore list
            if (this.ensIgnoreList.indexOf(hostname) === -1) {
                return true
            }
        }
        return false
    };

    /**
     * Checks if a given url or the current url is the homepage
     */
    isHomePage(checkUrl = null) {
        const currentPage = checkUrl || this.url
        const { host: currentHost } = getUrlObj(currentPage)
        return currentHost === DAPPS_CONFIG.HOMEPAGE_HOST
    }

    notifyAllConnections(payload, restricted = true) {
        if (!this.url) return
        const fullHostname = new URL(this.url).hostname

        // TODO:permissions move permissioning logic elsewhere
        this.backgroundBridges.forEach(bridge => {
            if (
              bridge.hostname === fullHostname &&
              // (!props.privacyMode || !restricted || this.approvedHosts[bridge.hostname])
              (!restricted || this.approvedHosts[bridge.hostname])
            ) {
                bridge.sendNotification(payload)
            }
        })
    }


    async polyfillGasPrice(method, params = []) {
        // const { TransactionController } = Engine.context;
        // const data = await util.query(TransactionController.ethQuery, method, params);
        //
        // if (data && data.maxFeePerGas && !data.gasPrice) {
        //     data.gasPrice = data.maxFeePerGas;
        // }
        //
        return { gasPrice: 21000 }
    }

    /**
     * Handle RPC methods called by dapps
     */
    // getRpcMethodMiddleware({ hostname, getProviderState }) {
    //     createAsyncMiddleware(async (req: JsonRpcRequest<any>, res: PendingJsonRpcResponse<any>, next) => {
    //         const getAccounts = async () => {
    //             const selectedAddress = getWalletStore().selectedWallet.address
    //             const privacyMode = false
    //             const isEnabled = !privacyMode || this.approvedHosts[hostname]
    //
    //             return isEnabled && selectedAddress ? [ selectedAddress ] : []
    //         }
    //
    //         const rpcMethods = {
    //             eth_coinbase: async () => {
    //                 const accounts = await getAccounts()
    //                 res.result = accounts.length > 0 ? accounts[0] : null
    //             },
    //
    //             personal_sign: async () => {
    //                 const firstParam = req.params[0]
    //                 const secondParam = req.params[1]
    //                 const params = {
    //                     data: firstParam,
    //                     from: secondParam
    //                 }
    //
    //                 if (resemblesAddress(firstParam) && !resemblesAddress(secondParam)) {
    //                     params.data = secondParam
    //                     params.from = firstParam
    //                 }
    //
    //                 const pageMeta = {
    //                     meta: {
    //                         url: this.url,
    //                         title: this.title,
    //                         icon: this.icon
    //                     }
    //                 }
    //                 const rawSig = await getAppStore().personalMessageManager.addUnapprovedMessageAsync({
    //                     ...params,
    //                     ...pageMeta
    //                 })
    //
    //                 res.result = rawSig
    //             },
    //
    //             eth_signTypedData: async () => {
    //                 const pageMeta = {
    //                     meta: {
    //                         url: this.url,
    //                         title: this.title,
    //                         icon: this.icon
    //                     }
    //                 }
    //                 const rawSig = await getAppStore().typedMessageManager.addUnapprovedMessageAsync(
    //                   {
    //                       data: req.params[0],
    //                       from: req.params[1],
    //                       ...pageMeta
    //                   },
    //                   'V1'
    //                 )
    //
    //                 res.result = rawSig
    //             },
    //
    //             eth_signTypedData_v3: async () => {
    //                 const data = JSON.parse(req.params[1])
    //                 const chainId = data.domain.chainId
    //                 const activeChainId = getEthereumProvider().currentNetwork.chainID
    //                   // props.networkType === RPC ? props.network : Networks[props.networkType].networkId
    //
    //                 // eslint-disable-next-line
    //                 if (chainId && chainId != activeChainId) {
    //                     throw ethErrors.rpc.invalidRequest(
    //                       `Provided chainId (${ chainId }) must match the active chainId (${ activeChainId })`
    //                     )
    //                 }
    //
    //                 const pageMeta = {
    //                     meta: {
    //                         url: this.url,
    //                         title: this.title,
    //                         icon: this.icon
    //                     }
    //                 }
    //
    //                 const rawSig = await getAppStore().typedMessageManager.addUnapprovedMessageAsync(
    //                   {
    //                       data: req.params[1],
    //                       from: req.params[0],
    //                       ...pageMeta
    //                   },
    //                   'V3'
    //                 )
    //
    //                 res.result = rawSig
    //             },
    //
    //             eth_signTypedData_v4: async () => {
    //                 const data = JSON.parse(req.params[1])
    //                 const chainId = data.domain.chainId
    //                 const activeChainId = getEthereumProvider().currentNetwork.chainID
    //
    //                 // eslint-disable-next-line eqeqeq
    //                 if (chainId && chainId != activeChainId) {
    //                     throw ethErrors.rpc.invalidRequest(
    //                       `Provided chainId (${ chainId }) must match the active chainId (${ activeChainId })`
    //                     )
    //                 }
    //
    //                 const pageMeta = {
    //                     meta: {
    //                         url: this.url,
    //                         title: this.title,
    //                         icon: this.icon
    //                     }
    //                 }
    //                 const rawSig = await getAppStore().typedMessageManager.addUnapprovedMessageAsync(
    //                   {
    //                       data: req.params[1],
    //                       from: req.params[0],
    //                       ...pageMeta
    //                   },
    //                   'V4'
    //                 )
    //
    //                 res.result = rawSig
    //             },
    //
    //             web3_clientVersion: async () => {
    //                 let version = this.appVersion
    //                 if (!version) {
    //                     this.appVersion = getVersion()
    //                     version = this.appVersion
    //                 }
    //                 res.result = `MetaMask/${ version }/Beta/Mobile`
    //             },
    //
    //             wallet_scanQRCode: () =>
    //               new Promise((resolve, reject) => {
    //                   this.navigation.navigate('QRScanner', {
    //                       onScanSuccess: data => {
    //                           const regex = new RegExp(req.params[0])
    //                           if (regex && !regex.exec(data)) {
    //                               reject({ message: 'NO_REGEX_MATCH', data })
    //                           } else if (!regex && !/^(0x){1}[0-9a-fA-F]{40}$/i.exec(data.target_address)) {
    //                               reject({ message: 'INVALID_ETHEREUM_ADDRESS', data: data.target_address })
    //                           }
    //                           let result = data
    //                           if (data.target_address) {
    //                               result = data.target_address
    //                           } else if (data.scheme) {
    //                               result = JSON.stringify(data)
    //                           }
    //                           res.result = result
    //                           resolve()
    //                       },
    //                       onScanError: e => {
    //                           throw ethErrors.rpc.internal(e.toString())
    //                       }
    //                   })
    //               }),
    //
    //             wallet_watchAsset: async () => {
    //                 const {
    //                     params: {
    //                         options: { address, decimals, image, symbol },
    //                         type
    //                     }
    //                 } = req
    //
    //                 const suggestionResult = await getAppStore().tokensController.watchAsset(
    //                   { address, symbol, decimals, image },
    //                   type
    //                 )
    //
    //                 res.result = suggestionResult.result
    //             },
    //


    getAccounts(host = this.url) {
        this.url = host || this.initialUrl
        const selectedAddress = getWalletStore().selectedWallet.address
        const isEnabled = this.approvedHosts.has(new URL(this.url).hostname)
        return isEnabled && selectedAddress ? [ selectedAddress ] : []
    }


    async onMessage({ nativeEvent }) {
        let data = nativeEvent.data
        try {
            console.log(data)
            data = typeof data === 'string' ? JSON.parse(data) : data
            if (!data || !data.type) {
                return
            }
            if (data.type === 'history-state-changed') {
                this.url = data.navState.url
                this.title = data.navState.title
            }
            if (data.permission === "web3") {
                console.log("web3-permission", this.url)
                const selectedAddress = getWalletStore().selectedWallet.address
                if (this.getAccounts(data.params?.host).length > 0) {
                    this.postMessage({
                        messageId: data.messageId,
                        type: "api-response",
                        permission: 'web3',
                        data: [ selectedAddress ],
                        isAllowed: true
                    })
                } else {
                    if (this.approvalDialog.display) return
                    this.approvalDialog.display = true
                    this.approvalDialog.hostName = new URL(data.params?.host).host || this.url

                    const approved = await new Promise((resolve, reject) => {
                        this.approvalDialog.approvalRequest = { resolve, reject }
                    })

                    if (approved) {
                        this.approvedHosts.add(new URL(data.params?.host).host)
                        this.postMessage({
                            messageId: data.messageId,
                            type: "api-response",
                            permission: 'web3',
                            data: [ selectedAddress ],
                            isAllowed: true
                        })
                    } else {
                        console.log("forbidden")
                        this.postMessage({
                            messageId: data.messageId,
                            type: "api-response",
                            permission: 'web3',
                            isAllowed: false
                        })
                    }
                }
            }

            if (data.type === "web3-send-async-read-only") {
                console.log(data.payload.method)
                switch (data.payload.method) {
                    case 'eth_getTransactionByHash':
                        this.postAsyncCallbackMessage({
                            result: await this.polyfillGasPrice('getTransactionByHash', data.params),
                            data
                        })
                        break
                    case 'eth_getTransactionByBlockHashAndIndex':
                        this.postAsyncCallbackMessage({
                            result: await this.polyfillGasPrice('eth_getTransactionByBlockHashAndIndex', data.params),
                            data
                        })
                        break
                    case 'eth_getTransactionByBlockNumberAndIndex':
                        this.postAsyncCallbackMessage({
                            result: await this.polyfillGasPrice('eth_getTransactionByBlockNumberAndIndex', data.params),
                            data
                        })
                        break
                    case 'eth_accounts':
                        this.postAsyncCallbackMessage({
                            result: this.getAccounts(),
                            data
                        })
                        break
                    case 'eth_chainId':
                        this.postAsyncCallbackMessage({
                            result: `0x${ Number(getEthereumProvider().currentNetwork.networkID).toString(16) }`,
                            data
                        })
                        break
                    case 'net_version':
                        this.postAsyncCallbackMessage({
                            result: getEthereumProvider().currentNetwork.networkID,
                            data
                        })
                        break
                    case 'eth_sign': {
                        const pageMeta = {
                            meta: {
                                url: this.url,
                                title: this.title,
                                icon: this.icon
                            }
                        }
                        this.postAsyncCallbackMessage({
                            result: await getAppStore().messageManager.addUnapprovedMessageAsync({
                                data: data.payload.params[1],
                                from: data.payload.params[0],
                                ...pageMeta
                            }),
                            data
                        })
                        break
                    }
                    case 'personal_sign': {
                        const firstParam = data.payload.params[0]
                        const secondParam = data.payload.params[1]
                        const params = {
                            data: firstParam,
                            from: secondParam
                        }

                        if (resemblesAddress(firstParam) && !resemblesAddress(secondParam)) {
                            params.data = secondParam
                            params.from = firstParam
                        }

                        const pageMeta = {
                            meta: {
                                url: this.url,
                                title: this.title,
                                icon: this.icon
                            }
                        }
                        this.postAsyncCallbackMessage({
                            result: await getAppStore().personalMessageManager.addUnapprovedMessageAsync({
                                ...params,
                                ...pageMeta
                            }),
                            data
                        })
                        break
                    }
                    case "eth_signTypedData": {
                        const firstParam = data.payload.params[0]
                        const secondParam = data.payload.params[1]
                        const pageMeta = {
                            meta: {
                                url: this.url,
                                title: this.title,
                                icon: this.icon
                            }
                        }
                        const params = {
                            data: firstParam,
                            from: secondParam
                        }

                        if (resemblesAddress(firstParam) && !resemblesAddress(secondParam)) {
                            params.data = secondParam
                            params.from = firstParam
                        }
                        this.postAsyncCallbackMessage({
                            result: await getAppStore().typedMessageManager.addUnapprovedMessageAsync(
                              {
                                  ...params,
                                  ...pageMeta
                              },
                              'V1'
                            ),
                            data
                        })
                        break
                    }
                    case 'eth_signTypedData_v3': {

                        const firstParam = data.payload.params[0]
                        const secondParam = data.payload.params[1]
                        const params = {
                            data: firstParam,
                            from: secondParam
                        }

                        const pageMeta = {
                            meta: {
                                url: this.url,
                                title: this.title,
                                icon: this.icon
                            }
                        }

                        if (resemblesAddress(firstParam) && !resemblesAddress(secondParam)) {
                            params.data = secondParam
                            params.from = firstParam
                        }

                        const chainId = JSON.parse(params.data).domain.chainId
                        const activeChainId = getEthereumProvider().currentNetwork.chainID

                        // eslint-disable-next-line
                        if (chainId && chainId != activeChainId) {
                            throw ethErrors.rpc.invalidRequest(
                              `Provided chainId (${ chainId }) must match the active chainId (${ activeChainId })`
                            )
                        }

                        this.postAsyncCallbackMessage({
                            result: await getAppStore().typedMessageManager.addUnapprovedMessageAsync(
                              {
                                  ...params,
                                  ...pageMeta
                              },
                              'V3'
                            ),
                            data
                        })
                        break
                    }
                    case 'eth_signTypedData_v4': {
                        const firstParam = data.payload.params[0]
                        const secondParam = data.payload.params[1]
                        const params = {
                            data: firstParam,
                            from: secondParam
                        }

                        const pageMeta = {
                            meta: {
                                url: this.url,
                                title: this.title,
                                icon: this.icon
                            }
                        }

                        if (resemblesAddress(firstParam) && !resemblesAddress(secondParam)) {
                            params.data = secondParam
                            params.from = firstParam
                        }

                        const chainId = JSON.parse(params.data).domain.chainId
                        const activeChainId = getEthereumProvider().currentNetwork.chainID

                        // eslint-disable-next-line
                        if (chainId && chainId != activeChainId) {
                            throw ethErrors.rpc.invalidRequest(
                              `Provided chainId (${ chainId }) must match the active chainId (${ activeChainId })`
                            )
                        }

                        this.postAsyncCallbackMessage({
                            result: await getAppStore().typedMessageManager.addUnapprovedMessageAsync(
                              {
                                  ...params,
                                  ...pageMeta
                              },
                              'V4'
                            ),
                            data
                        })
                        break
                    }
                }
            }
        } catch (e) {
            console.log("message error", e)
        }
    }

    postMessage(msg) {
        const js = JS_POST_MESSAGE_TO_PROVIDER(JSON.stringify(msg))
        this.webviewRef.injectJavaScript(js)
    }

    postAsyncCallbackMessage({ result, data }) {
        this.postMessage({
            messageId: data.messageId,
            type: "web3-send-async-callback",
            beta: true,
            result: { result }
        })
    }
}
