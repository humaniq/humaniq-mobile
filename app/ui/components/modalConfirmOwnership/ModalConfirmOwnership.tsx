import { observer } from "mobx-react-lite"
import { Modal } from "ui/components/modal/Modal"
import { useInstance } from "react-ioc"
import { WalletController } from "../../../controllers/WalletController"
import { t } from "../../../i18n/translate"
import { useStyles } from "./styles"
import { ActivityIndicator, Text } from "react-native-paper"
import { makeAutoObservable } from "mobx"

export class ModalConfirmOwnershipViewModel {
  visible = false
  setModal = (val) => {
    this.visible = val
  }

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
    <ActivityIndicator style={ styles.indicator } />
  </Modal>
})
