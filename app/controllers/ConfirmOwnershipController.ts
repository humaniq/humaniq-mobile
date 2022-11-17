import { makeAutoObservable } from "mobx"
import { inject } from "react-ioc"
import { ModalConfirmOwnershipViewModel } from "ui/components/modalConfirmOwnership/ModalConfirmOwnership"
import { WalletController } from "./WalletController"
import { localStorage } from "utils/localStorage"
import { moverConfirmationService } from "./services/ConfirmationOwnerShip"
import { UECode, UnexpectedError } from "utils/error/UnexpectedError"

export class ConfirmOwnershipController {

  confirmed = false
  initialized = false
  signature = ""
  wallet

  modal = inject(this, ModalConfirmOwnershipViewModel)

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

    const agreementText = `I confirm the ownership of address ${ this.wallet.address }, and agree to the terms and conditions.`

    this.modal.setModal(true)

    const sig = await this.wallet.trySign(agreementText)

    const succeeded = await moverConfirmationService.setConfirmation(this.wallet.address, sig)
    if (succeeded) {
      await localStorage.save(`sign[${ this.wallet.address }]`, sig)
      this.signature = sig
      this.confirmed = true
      this.modal.setModal(false)
    } else {
      throw new UnexpectedError(UECode.signErrorVerify)
    }
  }

  init = async (wallet: WalletController) => {
    this.wallet = wallet
    if (this.wallet.address === undefined) {
      throw new Error("empty address")
    }

    const storedSignature = await localStorage.load(`sign[${ this.wallet.address }]`)
    if (storedSignature && storedSignature !== "" ) {
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
