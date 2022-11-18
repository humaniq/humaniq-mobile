import { observer } from "mobx-react-lite"
import { Modal } from "ui/components/modal/Modal"
import { useInstance } from "react-ioc"
import { WalletController } from "../../../controllers/WalletController"
import { t } from "../../../i18n/translate"
import { useStyles } from "./styles"
import { Text } from "react-native-paper"
import { makeAutoObservable } from "mobx"
import { PrimaryButton } from "ui/components/button/PrimaryButton"

export class ModalConfirmOwnershipViewModel {
  visible = false
  pending = false
  setModal = (val) => {
    this.visible = val
  }

  closeModal = () => {
    this.setModal(false)
    this.pending = false
    this.onPressButton = () => null
  }

  closeAuto = () => {
    setTimeout(() => {
      this.closeModal()
    }, 3000)
  }


  onPressButton = () => null

  constructor() {
    makeAutoObservable(this)
  }
}

export const ModalConfirmOwnership = observer(() => {
  const styles = useStyles()
  const view = useInstance(ModalConfirmOwnershipViewModel)
  const wallet = useInstance(WalletController)
  return <Modal visible={ view?.visible } onDismiss={ async () => {
    view.setModal(false)
    await wallet.tryDisconnect()
  }
  }>
    <Text style={ styles.title }>{ t("confirmOwnership.title") }</Text>
    <Text style={ styles.description }>{ t("confirmOwnership.description") }</Text>
    <PrimaryButton
      pending={ view.pending }
      style={ styles.button }
      onPress={ view.onPressButton }
      title={ "Sign message" } />
  </Modal>
})
