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
import { Explorer } from "../explorers/Explorer"
import { AvailableNetworks } from "../references/networks"
import { PriceController } from "./PriceController"
import { TokenWithBalance } from "../references/tokens"
import { NFT } from "../references/nfts"


export class WalletController {

  web3 = inject<Web3Controller>(this, Web3Controller)
  confirmOwnership = inject<ConfirmOwnershipController>(this, ConfirmOwnershipController)
  priceController = inject<PriceController>(this, PriceController)
  toast = inject<ToastViewModel>(this, ToastViewModel)

  explorer: Explorer
  assets: TokenWithBalance[] = []
  nfts: NFT[] = []
  serviceInitialized = false
  triedToConnect = false
  loadedWalletContent = false

  destructor1 = () => null


  constructor() {
    makeAutoObservable(this, { explorer: false }, { autoBind: true })
  }

  connectProviderModalVisible = false

  setConnectProviderModal = (val: boolean) => {
    this.connectProviderModalVisible = val
  }


  get initialized() {
    return this.web3.isConnected && this.confirmOwnership.confirmed
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
    this.confirmOwnership.modal.closeModal()
    const confirmed = await this.confirmOwnership.init(this)
    if (!confirmed) {
      // процесс конфирмации
      try {
        await this.confirmOwnership.confirm()
      } catch (error) {
        if (error instanceof ExpectedError && error.getCode() === EECode.userRejectSign) {
          this.toast.auto(new ExpectedError(EECode.userRejectOwnershipSignature))
        } else {
          this.toast.auto(new UnexpectedError(UECode.signErrorVerify).wrap(error))
        }
        await this.tryDisconnect()
        this.triedToConnect = true
        return
      }
    }

    this.serviceInitialized = true

    addSentryBreadcrumb({
      type: "info",
      message: "Wallet initialized successfully",
    })

    this.explorer = new Explorer({
      availableNetworks: AvailableNetworks,
      currentAccount: this.address,
      confirmSignature: this.confirmOwnership.signature,
    })

    this.priceController.loadCommonPrices()

    const walletTokens = await this.explorer.getTokens()
    this.assets = walletTokens?.tokens
    this.nfts = walletTokens?.nfts


    addSentryBreadcrumb({
      type: "info",
      message: "Wallet tokens loaded",
    })

    this.loadedWalletContent = true

    this.destructor1()
    this.destructor1 = reaction(() => this.web3.address, async (val, prev) => {
      if (!val || val?.toLowerCase() === prev?.toLowerCase()) return
      await this.innerInit(true)
    })
  }

  tryDisconnect = async () => {
    await this.web3.disconnect()
    this.serviceInitialized = false
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

  updateTokens = async () => {
    try {
      const walletTokens = await this.explorer?.getTokens()
      if (walletTokens !== undefined) {
        this.assets = walletTokens.tokens
        this.nfts = walletTokens.nfts
      }
    } catch (error) {
      addSentryBreadcrumb({
        type: "warning",
        message: "Failed to update wallet tokens",
        data: {
          error,
        },
      })
    }
  }
}
