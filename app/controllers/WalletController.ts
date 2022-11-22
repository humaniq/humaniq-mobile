import { makeAutoObservable, reaction } from "mobx"
import { inject } from "react-ioc"
import { Web3Controller } from "./Web3Controller"
import { ProviderType } from "../references/providers"
import { addSentryBreadcrumb, captureSentryException } from "../logs/sentry"
import { UECode, UnexpectedError } from "utils/error/UnexpectedError"
import { isRejectedRequestError } from "utils/error/ProviderRPCError"
import { EECode, ExpectedError } from "utils/error/ExpectedError"
import { ConfirmOwnershipController } from "./ConfirmOwnershipController"
import { ToastViewModel } from "ui/components/toast/Toast"
import { Linking } from "react-native"
import { TERMS_OF_USE_URL } from "configs/env"


export class WalletController {

  web3 = inject(this, Web3Controller)
  confirmOwnership = inject(this, ConfirmOwnershipController)
  toast = inject(this, ToastViewModel)

  destructor1 = () => null

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
      console.log("web3 connected inner")
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

  handleTermsPress = async () => {
    try {
      await Linking.openURL(TERMS_OF_USE_URL)
    } catch (e) {
    }
  }

  innerInit = async (cached: boolean) => {
    if (!this.address) {
      return
      // throw new MoverError("Current address is undefined in wallet->init")
    }

    if (this.web3 === undefined) {
      return
      //throw new MoverError("WEb3 provider is undefined in wallet->init")
    }

    const confirmed = await this.confirmOwnership.init(this)
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

    this.destructor1()
    this.destructor1 = reaction(() => this.web3.address, async (val, prev) => {
      if (!val || val?.toLowerCase() === prev?.toLowerCase()) return
      await this.innerInit(true)
    })
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
      return await this.web3.signMessage(text)
    } catch (e) {
      if (isRejectedRequestError(e)) {
        throw new ExpectedError(EECode.userRejectSign)
      }

      throw new UnexpectedError(UECode.SignMessage).wrap(e)
    }
  }

}
