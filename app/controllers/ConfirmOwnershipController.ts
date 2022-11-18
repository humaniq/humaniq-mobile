import { makeAutoObservable } from "mobx"
import { inject } from "react-ioc"
import { ModalConfirmOwnershipViewModel } from "ui/components/modalConfirmOwnership/ModalConfirmOwnership"
import { WalletController } from "./WalletController"
import { localStorage } from "utils/localStorage"
import { moverConfirmationService } from "./services/ConfirmationOwnerShip"
import { UECode, UnexpectedError } from "utils/error/UnexpectedError"
import { ToastViewModel } from "ui/components/toast/Toast"
import { isRejectedRequestError } from "utils/error/ProviderRPCError"
import { EECode, ExpectedError } from "utils/error/ExpectedError"

export class ConfirmOwnershipController {

  confirmed = false
  initialized = false
  signature = ""
  wallet

  modal = inject(this, ModalConfirmOwnershipViewModel)
  toast = inject(this, ToastViewModel)

  disposer

  setSignature = async (sig: string) => {
    if (!this.wallet.initialized) {
      return
    }
    await localStorage.save(`sign[${ this.wallet.address }]`, sig)
  }

  confirm = async () => {
    console.log("confirm-modal")
    if (this.wallet.address === undefined) {
      throw new Error("empty address")
    }

    this.modal.setModal(true)

    this.modal.onPressButton = async () => {
      this.modal.pending = true
      const agreementText = `I confirm the ownership of address ${ this.wallet.address }, and agree to the terms and conditions.`

      await this.wallet.trySign(agreementText).catch(e => {
        this.modal.closeModal()
        this.toast.auto(isRejectedRequestError(e) ?
          new ExpectedError(EECode.userRejectSign) :
          new UnexpectedError(UECode.SignMessage).wrap(e))
        return
      }).then(async (sig) => {

        const succeeded = await moverConfirmationService.setConfirmation(this.wallet.address, sig)
        if (succeeded) {
          await localStorage.save(`sign[${ this.wallet.address }]`, sig)
          this.signature = sig
          this.confirmed = true
        } else {
          this.toast.auto(new UnexpectedError(UECode.signErrorVerify))
        }
        this.modal.closeModal()
      })
    }
  }

  init = async (wallet: WalletController) => {
    this.confirmed = false
    this.wallet = wallet
    if (this.wallet.address === undefined) {
      throw new Error("empty address")
    }

    const storedSignature = await localStorage.load(`sign[${ this.wallet.address }]`)
    if (storedSignature && storedSignature !== "") {
      const valid = await (moverConfirmationService.validConfirmation(
        this.wallet.address,
        storedSignature,
      ))
      if (valid) {
        this.signature = storedSignature
        this.confirmed = true
      } else {
        await this.setSignature("")
      }
    }

    this.initialized = true
    return this.confirmed
  }


  constructor() {
    makeAutoObservable(this)
  }
}
