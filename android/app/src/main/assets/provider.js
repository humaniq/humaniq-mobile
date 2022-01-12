(function () {
  if (typeof EthereumProvider === "undefined") {
    var callbackId = 0
    var callbacks = {}

    const __getFavicon = function () {
      let favicon
      const nodeList = document.getElementsByTagName("link")
      for (let i = 0; i < nodeList.length; i++) {
        const rel = nodeList[i].getAttribute("rel")
        if (rel === "icon" || rel === "shortcut icon") {
          favicon = nodeList[i]
        }
      }
      return favicon && favicon.href
    }

    var bridgeSend = function (data) {
      ReactNativeWebView.postMessage(JSON.stringify(data))
    }

    try {

      var history = window.history
      var pushState = history.pushState
      history.pushState = function (state) {
        setTimeout(function () {
          bridgeSend({
            type: 'history-state-changed',
            navState: { url: location.href, title: document.title, icon: __getFavicon(), canGoBack: history.length }
          })
        }, 100)
        return pushState.apply(history, arguments)
      }

      function sendAPIrequest (permission, params) {
        var messageId = callbackId++
        var params = params || {}

        bridgeSend({
          type: 'api-request',
          permission: permission,
          messageId: messageId,
          params: params
        })

        return new Promise(function (resolve, reject) {
          params['resolve'] = resolve
          params['reject'] = reject
          callbacks[messageId] = params
        })
      }

      function qrCodeResponse (data, callback) {
        var result = data.data
        var regex = new RegExp(callback.regex)
        if (!result) {
          if (callback.reject) {
            callback.reject(new Error("Cancelled"))
          }
        } else if (regex.test(result)) {
          if (callback.resolve) {
            callback.resolve(result)
          }
        } else {
          if (callback.reject) {
            callback.reject(new Error("Doesn't match"))
          }
        }
      }

      function Unauthorized (id) {
        this.name = "Unauthorized"
        this.id = id
        this.code = 4100
        this.message = "The requested method and/or account has not been authorized by the user."
      }

      Unauthorized.prototype = Object.create(Error.prototype)

      function UserRejectedRequest (id) {
        this.name = "UserRejectedRequest"
        this.id = id
        this.code = 4001
        this.message = "The user rejected the request."
      }

      UserRejectedRequest.prototype = Object.create(Error.prototype)

      ReactNativeWebView.onMessage = function (message) {

        data = JSON.parse(message)
        var id = data.messageId
        var callback = callbacks[id]

        if(data.type === 'getPageInfo') {
          bridgeSend({
            type: 'history-state-changed',
            navState: { url: location.href, title: document.title, icon: __getFavicon(), canGoBack: window.history.length }
          })
          return
        }

        if(data.type === 'accountsChanged') {
          window.ethereum.emit("accountsChanged", data.data)
        }
        if(data.type === 'networkChanged') {
          window.ethereum.emit("networkChanged", data.data)
        }

        if (callback) {
          if (data.type === "api-response") {
            if (data.permission === 'qr-code') {
              qrCodeResponse(data, callback)
            } else if (data.isAllowed) {
              if (data.permission === 'web3') {
                var selectedAddress = data.data[0]
                window.humaniqAppcurrentAccountAddress = selectedAddress
                // Set deprecated metamask fields
                window.ethereum.selectedAddress = selectedAddress
                window.ethereum.emit("accountsChanged", data.data)
                bridgeSend({ type: "set-web3", data: data.data })
              }
              callback.resolve(data.data)
            } else {
              bridgeSend({ type: "user-reject-request", data })
              callback.reject(new UserRejectedRequest(id))
            }
          } else if (data.type === "web3-send-async-callback") {
            if (callback.beta) {
              if (data.error) {
                if (data.error.code === 4100)
                  callback.reject(new Unauthorized(id))
                else
                  callback.reject(data.error)
              } else {
                callback.resolve(data.result.result)
              }
            } else if (callback.results) {
              callback.results.push(data.error || data.result)
              if (callback.results.length == callback.num)
                callback.callback(undefined, callback.results)
            } else {
              callback.callback(data.error, data.result)
            }
          }
        }
      }

      function web3Response (payload, result) {
        return {
          id: payload.id,
          jsonrpc: "2.0",
          result: result
        }
      }

      function getSyncResponse (payload) {
        if (payload.method == "eth_accounts" && (typeof window.humaniqAppcurrentAccountAddress !== "undefined")) {
          return web3Response(payload, [window.humaniqAppcurrentAccountAddress])
        } else if (payload.method == "eth_coinbase" && (typeof window.humaniqAppcurrentAccountAddress !== "undefined")) {
          return web3Response(payload, window.humaniqAppcurrentAccountAddress)
        } else if (payload.method == "net_version" || payload.method == "eth_chainId") {
          return web3Response(payload, window.humaniqAppNetworkId)
        } else if (payload.method == "eth_uninstallFilter") {
          return web3Response(payload, true)
        } else {
          return null
        }
      }

      var StatusAPI = function () {
      }

      StatusAPI.prototype.getContactCode = function () {
        return sendAPIrequest('contact-code')
      }

      var EthereumProvider = function () {
      }

      // EthereumProvider.prototype.isMetaMask = false
      // EthereumProvider.prototype.isStatus = false
      EthereumProvider.prototype.isHumaniq = true
      EthereumProvider.prototype.status = new StatusAPI()
      EthereumProvider.prototype.isConnected = function () {
        return false
      }
      // Set legacy metamask fields https://docs.metamask.io/guide/ethereum-provider.html#legacy-api
      EthereumProvider.prototype.networkVersion = window.humaniqAppNetworkId
      EthereumProvider.prototype.chainId = "0x" + Number(window.humaniqAppNetworkId).toString(16)
      EthereumProvider.prototype.networkId = window.humaniqAppNetworkId

      EthereumProvider.prototype._events = {}

      EthereumProvider.prototype.on = function (name, listener) {
        if (!this._events[name]) {
          this._events[name] = []
        }
        this._events[name].push(listener)
      }

      EthereumProvider.prototype.removeListener = function (name, listenerToRemove) {
        if (!this._events[name]) {
          return
        }

        const filterListeners = (listener) => listener !== listenerToRemove
        this._events[name] = this._events[name].filter(filterListeners)
      }

      EthereumProvider.prototype.emit = function (name, data) {
        if (!this._events[name]) {
          return
        }
        this._events[name].forEach(cb => cb(data))
      }
      EthereumProvider.prototype.enable = function () {
        return sendAPIrequest('web3', { url: location.href })
      }

      EthereumProvider.prototype.scanQRCode = function (regex) {
        return sendAPIrequest('qr-code', { regex: regex })
      }

      EthereumProvider.prototype.request = function (requestArguments) {
        try {
          if (!requestArguments) {
            return new Error('Request is not valid.')
          }
          var method = requestArguments.method

          if (!method) {
            return new Error('Request is not valid.')
          }

          // Support for legacy send method
          if (typeof method !== 'string') {
            return this.sendSync(method)
          }

          if (method === 'eth_requestAccounts') {
            return sendAPIrequest('web3', { url: location.href })
          }

          var syncResponse = getSyncResponse({ method: method })
          if (syncResponse) {
            return new Promise(function (resolve, reject) {
              resolve(syncResponse.result)
            })
          }

          var messageId = callbackId++
          var payload = {
            id: messageId,
            jsonrpc: "2.0",
            method: method,
            params: requestArguments.params
          }

          bridgeSend({
            type: 'web3-send-async-read-only',
            messageId: messageId,
            payload: payload,
            meta: {
              url: location.href
            }
          })

          return new Promise(function (resolve, reject) {
            callbacks[messageId] = {
              beta: true,
              resolve: resolve,
              reject: reject
            }
          })
        } catch (e) {
          bridgeSend({ error: e })
        }
      }

      // (DEPRECATED) Support for legacy send method
      EthereumProvider.prototype.send = function (method, params = []) {
        if (window.statusAppDebug) {
          console.log("send (legacy): " + method)
        }
        return this.request({ method: method, params: params })
      }

      // (DEPRECATED) Support for legacy sendSync method
      EthereumProvider.prototype.sendSync = function (payload) {
        if (window.statusAppDebug) {
          console.log("sendSync (legacy)" + JSON.stringify(payload))
        }
        if (payload.method == "eth_uninstallFilter") {
          this.sendAsync(payload, function (res, err) {
          })
        }
        var syncResponse = getSyncResponse(payload)
        if (syncResponse) {
          return syncResponse
        } else {
          return web3Response(payload, null)
        }
      }

      // (DEPRECATED) Support for legacy sendAsync method
      EthereumProvider.prototype.sendAsync = function (payload, callback) {
        if (window.statusAppDebug) {
          console.log("sendAsync (legacy)" + JSON.stringify(payload))
        }
        if (!payload) {
          return new Error('Request is not valid.')
        }
        if (payload.method == 'eth_requestAccounts') {
          return sendAPIrequest('web3', { url: location.href })
        }
        var syncResponse = getSyncResponse(payload)
        if (syncResponse && callback) {
          callback(null, syncResponse)
        } else {
          var messageId = callbackId++

          if (Array.isArray(payload)) {
            callbacks[messageId] = {
              num: payload.length,
              results: [],
              callback: callback
            }
            for (var i in payload) {
              bridgeSend({
                type: 'web3-send-async-read-only',
                messageId: messageId,
                payload: payload[i]
              })
            }
          } else {
            callbacks[messageId] = { callback: callback }
            bridgeSend({
              type: 'web3-send-async-read-only',
              messageId: messageId,
              payload: payload
            })
          }
        }
      }
    } catch (e) {
      bridgeSend({
        type: "error",
        payload: e
      })
    }
  }

  window.ethereum = new EthereumProvider()
})()
