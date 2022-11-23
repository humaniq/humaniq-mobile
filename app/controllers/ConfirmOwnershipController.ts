import { makeAutoObservable } from "mobx"
import { inject } from "react-ioc"
import { ModalConfirmOwnershipViewModel } from "ui/components/modalConfirmOwnership/ModalConfirmOwnership"
import { WalletController } from "./WalletController"
import { localStorage } from "utils/localStorage"
import { moverConfirmationService } from "./services/ConfirmationOwnerShip"
import { UECode, UnexpectedError } from "utils/error/UnexpectedError"
import { ToastViewModel } from "ui/components/toast/Toast"

export class ConfirmOwnershipController {

  confirmed = false
  initialized = false
  signature = ""
  wallet
  signRequest

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
    if (this.wallet.address === undefined) {
      throw new Error("empty address")
    }

    this.modal.setModal(true)

    this.modal.onDismiss = async () => {
      this.signRequest?.reject(false)
    }

    this.modal.onPressButton = async () => {
      try {
        this.modal.pending = true
        const agreementText = `I confirm the ownership of address ${ this.wallet.address }, and agree to the terms and conditions.`

        const sig = await this.wallet.trySign(agreementText)

        const succeeded = await moverConfirmationService.setConfirmation(this.wallet.address, sig)
        if (succeeded) {
          await localStorage.save(`sign[${ this.wallet.address }]`, sig)
          this.signature = sig
          this.confirmed = true
          this.signRequest.resolve(true)
        } else {
          this.signRequest.reject(new UnexpectedError(UECode.signErrorVerify))
          this.toast.auto(new UnexpectedError(UECode.signErrorVerify))
        }
        this.modal.closeModal()
      } catch (e) {
        this.signRequest.reject(e)
      }

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
