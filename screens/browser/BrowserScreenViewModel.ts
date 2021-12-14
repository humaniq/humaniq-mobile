import { makeAutoObservable, reaction } from "mobx"
import { MutableRefObject } from "react"
import { DAPPS_CONFIG } from "../../config/dapp"
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
import { SendTransactionViewModel } from "../../components/dialogs/sendTransactionDialog/SendTransactionViewModel"
import { ExploreModalViewModel } from "./ExploreModalViewModel"

export class BrowserScreenViewModel {

    navigation: NavigationProp<any>
    initialized = false
    backEnabled = false
    forwardEnabled = false
    progress = 0
    homePage = "https://humaniq.github.io/humaniq-dapps-home"
    initialUrl = "https://humaniq.github.io/humaniq-dapps-home" // https://metamask.github.io/test-dapp/" // 'https://dap.ps' // 'https://app.uniswap.org/'
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
    sendTransactionDialog = inject(this, SendTransactionViewModel)
    exploreModal = inject(this, ExploreModalViewModel)

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    async init(nav: NavigationProp<any>) {
        this.navigation = nav
        this.initialized = true
        const entryScriptWeb3 = await dappsProvider.get()
        this.entryScriptWeb3 = SET_NETWORK_ID(getEthereumProvider().currentNetwork.networkID) + entryScriptWeb3
        const result = this.go(this.homePage, true)
        if (result) {
            this.exploreModal.tabs[0] = { url: result, title: "", icon: "" }
            this.exploreModal.selectedTab = 0
        }

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

    onPressSearch() {
        this.isSearchMode = !this.isSearchMode
    }

    isSearchMode = false


    onSearchSubmit(val) {
        this.isSearchMode = false
        const result = this.go(val)
        if (result) {
            this.exploreModal.tabs.push({ url: result, title: "", icon: "" })
            this.exploreModal.selectedTab++
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
     * Stops normal loading when it's ens, instead call go to be properly set up
     */
    onShouldStartLoadWithRequest({ url }) {
        if (this.isENSUrl(url)) {
            this.go(url.replace(/^http:\/\//, 'https://'))
            return false
        }
        return true
    };

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

    //         const rpcMethods = {
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
                this.icon = data.navState.icon.replace("svg", "png")
                this.backEnabled = !!(data.navState.canGoBack - 1)

                this.exploreModal.tabs[this.exploreModal.selectedTab] = {
                    url: this.url,
                    title: this.title,
                    icon: this.icon
                }
            }
            if (data.permission === "web3") {
                console.log("web3-permission", this.url, new URL(data.params?.url).host)
                const selectedAddress = getWalletStore().selectedWallet.address
                if (this.getAccounts(data.params?.url).length > 0) {
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
                    this.approvalDialog.hostName = new URL(data.params?.url).host || this.url

                    const approved = await new Promise((resolve, reject) => {
                        this.approvalDialog.approvalRequest = { resolve, reject }
                    })

                    if (approved) {
                        this.approvedHosts.add(new URL(data.params?.url).host)
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
                    case 'eth_coinbase':
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
                    case 'eth_sendTransaction': {
                        if (this.sendTransactionDialog.display) return
                        await this.sendTransactionDialog.init(data.payload.params[0], data.meta)
                        const approved = await new Promise((resolve, reject) => {
                            this.sendTransactionDialog.approvalRequest = {
                                resolve,
                                reject
                            }
                        })

                        if (approved) {
                            try {
                                // @ts-ignore
                                const result = await getWalletStore().selectedWallet.ether.sendTransaction(approved.tx)
                                this.sendTransactionDialog.txHash = result.hash
                                this.postAsyncCallbackMessage({
                                    result: { hash: result.hash, message: "success" },
                                    data
                                })
                            } catch (e) {
                                this.postAsyncCallbackMessage({
                                    result: { message: 'error', error: e },
                                    data
                                })
                            }
                        }
                        this.postAsyncCallbackMessage({
                            result: { message: 'rejected' },
                            data
                        })
                        break
                    }
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

    /**
     * Handles state changes for when the url changes
     */
    changeUrl(siteInfo, type) {
        this.backEnabled = siteInfo.canGoBack
        this.forwardEnabled = siteInfo.canGoForward
        // isTabActive() &&
        // props.navigation.setParams({
        //     url: getMaskedUrl(siteInfo.url),
        //     icon: siteInfo.icon,
        //     silent: true
        // })
        //
        // props.updateTabInfo(getMaskedUrl(siteInfo.url), props.id)
        //
        // props.addToBrowserHistory({
        //     name: siteInfo.title,
        //     url: getMaskedUrl(siteInfo.url)
        // })
    };

    onLoadEnd({ nativeEvent }) {
        if (nativeEvent.loading) return
        console.log("END-LOADING")
        this.webviewRef.injectJavaScript(JS_POST_MESSAGE_TO_PROVIDER(JSON.stringify({ type: 'getPageInfo' })))
        const { hostname: currentHostname } = this.url ? new URL(this.url) : { hostname: this.initialUrl }
        const { hostname } = new URL(nativeEvent.url)
        if (currentHostname === hostname) {
            this.changeUrl({ ...nativeEvent, icon: this.icon }, 'end-promise')
        }
    }

    onProgress({ nativeEvent: { progress } }) {
        this.progress = progress * 100
    }

    get isHomePage() {
        return this.homePage === this.url
    }

    isAllowedUrl(hostName) {
        return !getAppStore().phishingController.test(hostName)
    }

    handleNotAllowedUrl(urlTogo) {
        this.blockedUrl = urlTogo
        this.showPhishingModal = true
    }

    goBack() {
        if (!this.backEnabled) return
        this.webviewRef?.goBack()
    }

    goForward() {
        if (!this.forwardEnabled) return
        this.webviewRef?.goForward()
    }

    navChanged(nav) {
        console.log("NAV-CHANGED", nav)
        this.backEnabled = nav.canGoBack
        this.forwardEnabled = nav.canGoForward
        this.url = nav.url
        this.title = nav.title
    }

    go(url, initialCall = false) {
        if (url === this.initialUrl) {
            this.forwardEnabled = false
            this.backEnabled = false
        }
        const hasProtocol = url.match(/^[a-z]*:\/\//)
        const sanitizedURL = hasProtocol ? url : `${ "https://" }${ url }`
        const { hostname } = new URL(sanitizedURL.toLowerCase())
        const urlToGo = sanitizedURL[sanitizedURL.length - 1] === "/" ? sanitizedURL : `${ sanitizedURL }/`
        // const isEnsUrl = this.isENSUrl(url);

        // if (isEnsUrl) {
        //    this.webviewRef && this.webviewRef.stopLoading();
        //     const { url: ensUrl, type, hash, reload } = await this.handleIpfsContent(url, { hostname, search, pathname });
        //     if (reload) return this.go(ensUrl);
        //     urlToGo = ensUrl;
        //     this.sessionENSNames[urlToGo] = { hostname, hash, type };
        // }

        if (this.isAllowedUrl(hostname)) {
            if (initialCall) {
                this.initialUrl = urlToGo
                this.firstUrlLoaded = true
            } else {
                this.webviewRef && this.webviewRef.injectJavaScript(`(function(){window.location.href = '${ urlToGo }' })()`)
            }

            this.progress = 0
            return urlToGo
        }
        this.handleNotAllowedUrl(urlToGo)
        return null
    }
}
