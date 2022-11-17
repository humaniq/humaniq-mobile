import { makeAutoObservable } from "mobx"
import { inject } from "react-ioc"
import { Web3Controller } from "./Web3Controller"
import { ProviderType } from "../references/providers"
import { addSentryBreadcrumb, captureSentryException } from "../logs/sentry"
import { UECode, UnexpectedError } from "utils/error/UnexpectedError"
import { MoverError } from "../services/MoverError"
import { isRejectedRequestError } from "utils/error/ProviderRPCError"
import { EECode, ExpectedError } from "utils/error/ExpectedError"
import { ConfirmOwnershipController } from "./ConfirmOwnershipController"
import { ToastViewModel } from "ui/components/toast/Toast"

export class WalletController {

  web3 = inject(this, Web3Controller)
  confirmOwnership = inject(this, ConfirmOwnershipController)
  toast = inject(this, ToastViewModel)

  constructor() {
    makeAutoObservable(this, null, { autoBind: true })
  }

  connectProviderModalVisible = false

  setConnectProviderModal = (val: boolean) => {
    console.log("SET-connect", val)
    this.connectProviderModalVisible = val
  }

  triedToConnect = false

  get isWalletReady() {
    return this.web3.isConnected // && confirmOwnership.confirmed.value;
  }

  get address() {
    return this.web3.address
  }

  get shortAddress() {
    return this.web3.shortAddress
  }

  get network() {
    return this.web3.network
  }

  get initialized() {
    return this.isWalletReady
  }

  get balance() {
    return 0
  }

  tryInit = async (providerType?: ProviderType): Promise<void> => {
    this.setConnectProviderModal(false)
    addSentryBreadcrumb({
      type: "info",
      message: "Wallet initialize...",
    })
    try {
      await this.web3.connect(providerType)
    } catch (err) {
      addSentryBreadcrumb({
        type: "error",
        message: "web3 initializing failed",
      })
      throw err
    }

    if (this.web3.isConnected) {
      await this.innerInit(false)
    }
  }

  tryInitCached = async () => {
    addSentryBreadcrumb({
      type: "info",
      message: "Wallet initialize (from cache)...",
    })
    try {
      const connected = await this.web3.tryConnectCachedProvider()
      if (connected) {
        await this.innerInit(true)
      }
    } catch (err) {
      if (
        err instanceof UnexpectedError &&
        err.getCode() === UECode.EmptyConfirmationUponCachedInit
      ) {
        // throw known error to trigger
        // special handler
        //
        // UI will be unlocked by then, thanks to finally block assignment
        // and the router guard will do its job in background
        throw err
      }

      addSentryBreadcrumb({
        type: "error",
        message: "web3 initializing failed (from cache)",
      })
      captureSentryException(err)
      // toast.auto(new UnexpectedError(UECode.ConnectCacheProviderWeb3));
    } finally {
      this.triedToConnect = true
    }
  }

  innerInit = async (cached: boolean) => {
    if (this.address === undefined) {
      throw new MoverError("Current address is undefined in wallet->init")
    }

    if (this.web3 === undefined) {
      throw new MoverError("WEb3 provider is undefined in wallet->init")
    }

    const confirmed = await this.confirmOwnership.init(this)
    console.log(confirmed)
    if (!confirmed) {
      // процесс конфирмации
      try {
        // useWeb3Modal().closeModal();
        await this.confirmOwnership.confirm()
      } catch (error) {
        if (error instanceof ExpectedError && error.getCode() === EECode.userRejectSign) {
          this.toast.auto(new ExpectedError(EECode.userRejectOwnershipSignature))
        } else {
          this.toast.auto(new UnexpectedError(UECode.signErrorVerify).wrap(error))
        }
      }
      this.triedToConnect = true
    }

    // explorer = new Explorer({
    //   MoralisAPIKey: getAPIKey('MORALIS_API_KEY'),
    //   availableNetworks: AvailableNetworks,
    //   currentAccount: address.value,
    //   confirmSignature: confirmOwnership.signature.value,
    //   web3Provider: web3.value,
    //   AnkrAPIKey: getAPIKey('ANKR_API_KEY'),
    //   AlchemyAPIKey: getAPIKey('ALCHEMY_API_KEY')
    // });
    //
    addSentryBreadcrumb({
      type: "info",
      message: "Wallet initialized successfully",
    })
    // const { loadCommonPrices } = useTokenPrice();
    // // load utility prices asynchronously
    // loadCommonPrices();
    //
    // // todo: make reinit function (after-tx-cleanup)
    // state.assets = await explorer.getTokens();
    //
    // // TODO: for devs purposes, remove before release
    // console.log(state.assets);
    //
    // addSentryBreadcrumb({
    //   type: 'info',
    //   message: 'Wallet tokens loaded'
    // });
  }

  tryDisconnect = async () => {
    await this.web3.disconnect()
  }

  trySign = async (text: string): Promise<string> => {
    if (this.address === undefined) {
      throw new UnexpectedError(UECode.WalletSignEmptyAddress)
    }

    if (this.web3.provider === undefined) {
      throw new UnexpectedError(UECode.WalletSignEmptyWeb3Provider)
    }

    try {
      // return await this.web3.signMessage(text)

      const msgParams = JSON.stringify({
        domain: {
          // Defining the chain aka Rinkeby testnet or Ethereum Main Net
          chainId: parseInt(this.web3.ethereum.chainId, 16),
          // Give a user friendly name to the specific contract you are signing for.
          name: "Ether Mail",
          // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
          verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
          // Just let's you know the latest version. Definitely make sure the field name is correct.
          version: "1",
        },

        // Defining the message signing data content.
        message: {
          /*
           - Anything you want. Just a JSON Blob that encodes the data you want to send
           - No required fields
           - This is DApp Specific
           - Be as explicit as possible when building out the message schema.
          */
          contents: "Hello, Bob!",
          attachedMoneyInEth: 4.2,
          from: {
            name: "Cow",
            wallets: [
              "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
              "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
            ],
          },
          to: [
            {
              name: "Bob",
              wallets: [
                "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
                "0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57",
                "0xB0B0b0b0b0b0B000000000000000000000000000",
              ],
            },
          ],
        },
        // Refers to the keys of the *types* object below.
        primaryType: "Mail",
        types: {
          // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          // Not an EIP712Domain definition
          Group: [
            { name: "name", type: "string" },
            { name: "members", type: "Person[]" },
          ],
          // Refer to PrimaryType
          Mail: [
            { name: "from", type: "Person" },
            { name: "to", type: "Person[]" },
            { name: "contents", type: "string" },
          ],
          // Not an EIP712Domain definition
          Person: [
            { name: "name", type: "string" },
            { name: "wallets", type: "address[]" },
          ],
        },
      })

      const from = this.web3.address
      const params = [ from, msgParams ]
      const method = "eth_signTypedData_v4"

      const response = await this.web3.ethereum.request({ method, params })
      console.log({ response })
      return response

    } catch (e) {
      if (isRejectedRequestError(e)) {
        throw new ExpectedError(EECode.userRejectSign)
      }

      throw new UnexpectedError(UECode.SignMessage).wrap(e)
    }
  }

}
