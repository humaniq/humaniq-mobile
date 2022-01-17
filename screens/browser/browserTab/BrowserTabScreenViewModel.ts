import { makeAutoObservable, reaction } from "mobx"
import { MutableRefObject } from "react"
import { DAPPS_CONFIG } from "../../../config/dapp"
import { getAppStore, getBrowserStore, getEthereumProvider, getWalletStore } from "../../../App"
// import { createAsyncMiddleware, JsonRpcRequest, PendingJsonRpcResponse } from "json-rpc-engine"
import { NavigationProp } from "@react-navigation/native"
// import BackgroundBridge from "../../core/BackgroundBridge"
import { dappsProvider } from "../../../utils/DappsProvider"
import { getSnapshot } from "mobx-keystone"
import { JS_POST_MESSAGE_TO_PROVIDER, SET_NETWORK_ID } from "../../../utils/browserScripts"
import { inject } from "react-ioc"
import {
  ApprovalDappConnectDialogViewModel
} from "../../../components/dialogs/approvalDappConnectDialog/ApprovalDappConnectDialogViewModel"
import { resemblesAddress } from "../../../utils/address"
import { ethErrors } from 'eth-json-rpc-errors'
import { SendTransactionViewModel } from "../../../components/dialogs/sendTransactionDialog/SendTransactionViewModel"
import { IBrowserTab } from "./BrowserTabScreen";
import { EthereumTransaction } from "../../../store/wallet/transaction/EthereumTransaction";
import { InteractionManager } from "react-native";
import { closeToast, setPendingAppToast } from "../../../store/wallet/transaction/utils";
import { t } from "../../../i18n";
import { TOAST_POSITION } from "../../../components/toasts/appToast/AppToast";
import { HistoryItem } from "../../../store/browser/BrowserStore";

export class BrowserTabScreenViewModel {

  navigation: NavigationProp<any>
  initialized = false
  backEnabled = false
  forwardEnabled = false
  progress = 0
  homePage = DAPPS_CONFIG.HOMEPAGE_HOST
  initialUrl = DAPPS_CONFIG.HOMEPAGE_HOST
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
  searchValue = ""

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
  id

  approvalDialog = inject(this, ApprovalDappConnectDialogViewModel)
  sendTransactionDialog = inject(this, SendTransactionViewModel)

  disposerChangeNetwork
  disposerChangeAddress


  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  get isTabActive() {
    return this.id === getBrowserStore().activeTab
  }

  get storedTab() {
    return getBrowserStore().tabs.find(t => t.id === this.id)
  }

  async init(nav: NavigationProp<any>, props: IBrowserTab) {
    this.id = props.id
    this.navigation = nav
    this.initialized = true
    const entryScriptWeb3 = await dappsProvider.get()
    this.entryScriptWeb3 = SET_NETWORK_ID(getEthereumProvider().currentNetwork.networkID) + entryScriptWeb3
    this.initialUrl = this.storedTab.url
    this.url = this.storedTab.url
    this.go(props.initialUrl, true)


    this.disposerChangeNetwork = reaction(() => getSnapshot(getEthereumProvider().currentNetworkName), () => {
      // this.entryScriptWeb3 = SET_NETWORK_ID(getEthereumProvider().currentNetwork.networkID) + entryScriptWeb3
      this.reloadWebView()

      // this.postMessage({
      //   type: "networkChanged",
      //   data: getEthereumProvider().currentNetwork.networkID,
      // })
    })

    this.disposerChangeAddress = reaction(() => getSnapshot(getWalletStore().selectedWallet.address), () => {
      this.reloadWebView()
      // this.postMessage({
      //   type: "accountsChanged",
      //   data: [ getWalletStore().selectedWallet.address ],
      // })
    })
  }

  onSearchChange(val) {
    this.searchValue = val
  }

  get searchResults(): Array<[ string, HistoryItem ]> {
    return (this.searchValue ? getBrowserStore().historyKeys.filter(el => el[0].includes(this.searchValue)) : []) as Array<[ string, HistoryItem ]>
  }

  disposeAll() {
    this.disposerChangeAddress()
    this.disposerChangeNetwork()
  }

  async reloadWebView() {
    try {
      this.webviewRef?.reload()

      this.postMessage({
        type: "networkChanged",
        data: getEthereumProvider().currentNetwork.networkID,
      })
      this.postMessage({
        type: "accountsChanged",
        data: [ getWalletStore().selectedWallet.address ],
      })

    } catch (e) {
      console.log("ERROR", e)
    }
  }

  onPressSearch() {
    this.isSearchMode = !this.isSearchMode
  }

  isSearchMode = false

  onSearchSubmit(val) {
    this.isSearchMode = false
    this.go(val)
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
      data = typeof data === 'string' ? JSON.parse(data) : data
      if (!data || !data.type) {
        return
      }
      if (data.type === 'history-state-changed') {
        this.url = data.navState.url
        this.title = data.navState.title
        this.icon = data.navState.icon.replace("svg", "png")
        this.storedTab.setIcon(this.icon)
        this.storedTab.setTittle(this.title)
        getBrowserStore().addToBrowserHistory(new HistoryItem({
          url: this.url,
          tittle: this.title,
          icon: this.icon
        }))
        getBrowserStore().saveTabs()
      }
      if (data.permission === "web3") {
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
        switch (data.payload.method) {
          case 'eth_blockNumber':
            this.postAsyncCallbackMessage({
              result: await getEthereumProvider().currentProvider.getBlockNumber(),
              data
            })
            break
          case 'eth_call':
            this.postAsyncCallbackMessage({
              result: await getEthereumProvider().currentProvider.call(data.payload.params[0]),
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

            try {
              const approved = await new Promise((resolve, reject) => {
                this.sendTransactionDialog.approvalRequest = {
                  resolve,
                  reject
                }
              })

              this.sendTransactionDialog.display = false
              setPendingAppToast(t("sendTransactionDialog.transactionSending"), TOAST_POSITION.UNDER_TAB_BAR)
              InteractionManager.runAfterInteractions(async () => {
                // @ts-ignore
                const tx = new EthereumTransaction(approved.tx)
                const result = await tx.sendTransaction()
                if (!result) {
                  this.postAsyncCallbackMessage({
                    data,
                    error: "Error send transaction"
                  })
                }
                closeToast()
                this.postAsyncCallbackMessage({
                  result: tx.hash,
                  data
                })
                tx.applyToWallet()
                setTimeout(async () => {
                  await tx.waitTransaction()
                }, 10)
              })
            } catch (e) {
              this.postAsyncCallbackMessage({
                data,
                error: { code: 4001, message: "user rejected request" }
              })
            }
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
            const pageMeta = {
              meta: {
                url: this.url,
                title: this.title,
                icon: this.icon
              }
            }
            const params = {
              data: data.payload.params[1],
              from: data.payload.params[0]
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
            const params = {
              from: data.payload.params[0],
              data: JSON.parse(data.payload.params[1])
            }

            const pageMeta = {
              meta: {
                url: this.url,
                title: this.title,
                icon: this.icon
              }
            }

            const chainId = params.data.domain.chainId
            const activeChainId = getEthereumProvider().currentNetwork.chainID

            if (chainId && chainId !== activeChainId) {
              this.postAsyncCallbackMessage({
                result: ethErrors.rpc.invalidRequest(
                    `Provided chainId (${ chainId }) must match the active chainId (${ activeChainId })`
                ),
                data
              })
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
            const params = {
              from: data.payload.params[0],
              data: JSON.parse(data.payload.params[1])
            }

            const pageMeta = {
              meta: {
                url: this.url,
                title: this.title,
                icon: this.icon
              }
            }

            const chainId = params.data.domain.chainId
            const activeChainId = getEthereumProvider().currentNetwork.chainID

            if (chainId && chainId !== activeChainId) {
              this.postAsyncCallbackMessage({
                result: ethErrors.rpc.invalidRequest(
                    `Provided chainId (${ chainId }) must match the active chainId (${ activeChainId })`
                ),
                data
              })
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
          default:
            this.postAsyncCallbackMessage({
              result: await getEthereumProvider().jsonRPCProvider.send(data.payload.method, data.payload.params),
              data
            })
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

  postAsyncCallbackMessage({ result = {}, data, error = undefined }) {
    this.postMessage({
      messageId: data.messageId,
      type: "web3-send-async-callback",
      beta: true,
      result: { result },
      error
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
    this.postMessage({
      type: "networkChanged",
      data: getEthereumProvider().currentNetwork.networkID,
    })
    this.postMessage({
      type: "accountsChanged",
      data: [ getWalletStore().selectedWallet.address ],
    })
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
    this.backEnabled = nav.canGoBack
    this.forwardEnabled = nav.canGoForward
    this.url = nav.url
    this.title = nav.title
    this.storedTab.setUrl(nav.url)
    getBrowserStore().saveTabs()
  }

  goHomePage() {
    !this.isHomePage && this.go(this.homePage)
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
      this.storedTab.setUrl(urlToGo)
      getBrowserStore().saveTabs()
      return urlToGo
    }
    this.handleNotAllowedUrl(urlToGo)
    return null
  }
}
