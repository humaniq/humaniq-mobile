import { Modal as M, Portal } from "react-native-paper"
import { ModalProps } from "ui/components/modal/types"
import { useStyles } from "./styles"

export const Modal = (props: ModalProps) => {
  const style = useStyles()

  return <Portal><M { ...props } contentContainerStyle={ [ style.root, props.style ] } /></Portal>
}
