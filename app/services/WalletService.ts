import { makeAutoObservable } from "mobx"
import { inject } from "react-ioc"
import { ProviderService } from "./ProviderService"
import { ProviderType } from "../references/providers"
import { addSentryBreadcrumb, captureSentryException } from "../logs/sentry"
import { UECode, UnexpectedError } from "utils/error/UnexpectedError"
import { MoverError } from "utils/error/MoverError"
import { Linking } from "react-native"

export class WalletService {

  provider = inject(this, ProviderService)

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
    return this.provider.isConnected // && confirmOwnership.confirmed.value;
  }

  get address() {
    return this.provider.address
  }

  get shortAddress() {
    return this.provider.shortAddress
  }

  get network() {
    return this.provider.network
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
      await this.provider.connect(providerType)
    } catch (err) {
      addSentryBreadcrumb({
        type: "error",
        message: "web3 initializing failed",
      })
      throw err
    }

    if (this.provider.isConnected) {
      await this.innerInit(false)
    }
  }

  tryInitCached = async () => {
    addSentryBreadcrumb({
      type: "info",
      message: "Wallet initialize (from cache)...",
    })
    try {
      const connected = await this.provider.tryConnectCachedProvider()
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
      await Linking.openURL("https://viamover.com/terms_of_use")
    } catch (e) {}
  }

  innerInit = async (cached: boolean) => {
    if (this.address === undefined) {
      throw new MoverError("Current address is undefined in wallet->init")
    }

    if (this.provider === undefined) {
      throw new MoverError("WEb3 provider is undefined in wallet->init")
    }

    const confirmed = true //  await confirmOwnership.init();
    if (!confirmed) {
      // процесс конфирмации
      // try {
      //   useWeb3Modal().closeModal();
      //   await confirmOwnership.confirm();
      // } catch (error) {
      //   if (error instanceof ExpectedError && error.getCode() === EECode.userRejectSign) {
      //     toast.auto(new ExpectedError(EECode.userRejectOwnershipSignature));
      //   } else {
      //     toast.auto(new UnexpectedError(UECode.signErrorVerify).wrap(error));
      //   }
    }
    this.triedToConnect = true

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

}
