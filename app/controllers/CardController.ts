import { localStorage } from "utils/localStorage"
import { makeAutoObservable } from "mobx"
import { CardStatus, Gender, GetInfoResponse } from "../services/api/mover/card/types"
import { CardSkinController } from "./CardSkinController"
import { inject } from "react-ioc"
import { WalletController } from "./WalletController"
import dayjs from "dayjs"
import { PermitData, TokenWithBalance } from "../references/tokens"
import { TransferData } from "../services/api/mover/swap/types"
import { CompoundEstimateWithUnwrapResponse } from "../services/api/mover/onchain/types"
import { TransactionScenario } from "../services/api/mover/onchain/transaction-states"

export enum CardState {
  OrderNow = "order-now",
  Active = "active",
  Frozen = "frozen",
  Pending = "pending",
  Expired = "expired"
}

export enum OrderState {
  SelectSkin = "select-skin",
  SelectTag = "select-tag",
  PersonalDataForm = "personal-data-form",
  ContactDetailsForm = "contact-details-form",
  ValidatePhone = "validate-phone",
  ChangePhone = "change-phone"
}

export class CardController {

  showCardInfo
  loading = false
  data = {
    cardState: CardState.OrderNow,
    orderState: OrderState.SelectSkin,
    last4Digits: "",
    iban: "",
    holder: "",
    expiration: undefined
  }
  error

  skinService = inject(this, CardSkinController)
  walletService = inject(this, WalletController)


  constructor() {
    makeAutoObservable(this)
  }

  resetStateData = () => {
    const mappedStates = this.mapCardStatusToStates(CardStatus.NotRegistered)
    this.data.cardState = mappedStates.cardState
    this.data.orderState = mappedStates.orderState
    this.data.last4Digits = ""
    this.data.iban = ""
    this.data.holder = ""
    this.data.expiration = undefined
    // resetApprovedAddressesState();
  }

  mapCardStatusToStates = (
    status: CardStatus,
  ): { cardState: CardState; orderState: OrderState } => {
    switch (status) {
      case CardStatus.NotRegistered:
        if (!this.skinService.selectedCardSkin) {
          return { cardState: CardState.OrderNow, orderState: OrderState.SelectSkin }
        }

        // if (currentTag.value === undefined) {
        //   return { cardState: CardState.OrderNow, orderState: OrderState.SelectTag };
        // }

        return { cardState: CardState.OrderNow, orderState: OrderState.PersonalDataForm }
      case CardStatus.ContactDetails:
        return { cardState: CardState.OrderNow, orderState: OrderState.ContactDetailsForm }
      case CardStatus.PhoneVerification:
        return { cardState: CardState.OrderNow, orderState: OrderState.ValidatePhone }
      case CardStatus.KYCWaiting:
      case CardStatus.KYCPending:
      case CardStatus.CardOrder:
      case CardStatus.Shipped:
        return { cardState: CardState.Pending, orderState: OrderState.PersonalDataForm }
      case CardStatus.Active:
      case CardStatus.CardActive:
        return { cardState: CardState.Active, orderState: OrderState.ContactDetailsForm }
      default:
        throw new Error(`Invalid state`)
    }
  }

  getInfo = () => {
    if (this.walletService.address === undefined) {
      throw new Error("Empty address")
    }

    // if (!confirmed.value) {
    //   throw new Error('empty confirmation signature');
    // }

    this.loading = true
    this.error = undefined
  }

  setPersonalInfo = (gender: Gender, firstName, lastName,dateOfBirth) => {

  }

  last4PhoneNumberDigits = ""

  setContactDetails = (email: string, phone: string) => {}
  setOrderState = (s: OrderState) => {}
  changePhone = (phone: string) => {}
  resendSecurityCode = () => {}
  validatePhone = () => {}
  handleInfoResult = (info?: GetInfoResponse): void => {
    if (info === undefined) {
      this.resetStateData()
      return
    }

    let flowStates = this.mapCardStatusToStates(info.status)
    if (info.status === CardStatus.CardActive) {
      // loadApprovedWallets()
      flowStates = this.mapCardStatusToStates(info.cardInfo.status)
      this.data.cardState = flowStates.cardState
      this.data.orderState = flowStates.orderState

      this.data.holder = info.cardInfo.displayName
      this.data.iban = info.cardInfo.iban
      this.data.last4Digits = info.cardInfo.last4Digits

      const expirationDate = dayjs(new Date(info.cardInfo.expYear, info.cardInfo.expMonth - 1, 1))
      this.data.expiration = expirationDate

      if (info.cardInfo.temporaryBlocked) {
        this.data.cardState = CardState.Frozen
      }

      const now = dayjs()
      if (now.isAfter(expirationDate, "day")) {
        this.data.cardState = CardState.Expired
      }
    } else {
      this.resetStateData()
      this.data.cardState = flowStates.cardState
      this.data.orderState = flowStates.orderState
    }
  }
  setShowCardInfo = (value: boolean) => {}
  init = async () => {
    this.showCardInfo = await localStorage.load("show-card-info", false)
  }
  getTransferDataForTopUp = (inputToken: TokenWithBalance, tokenAmount: string) => {}
  estimateTopUpLegacy = (
    inputToken: TokenWithBalance,
    tokenAmount: string,
    transferData: TransferData | undefined
  ) => {}

  topUpLegacy = (
    inputToken: TokenWithBalance,
    tokenAmount: string,
    transferData: TransferData | undefined,
    estimation: CompoundEstimateWithUnwrapResponse,
    onTransactionHash: () => Promise<void>
  ) => {}

  topUp = async (
    inputToken: TokenWithBalance & PermitData,
    tokenAmount: string,
    transferData: TransferData | undefined,
    tagHash: string,
    bridgingFeeInUSDC: string,
    scenario: TransactionScenario,
    onTransactionSend: (uniqueId?: string) => void
  ) => {}

  explainTopUp = async (inputToken: TokenWithBalance & PermitData) => {

  }


}
