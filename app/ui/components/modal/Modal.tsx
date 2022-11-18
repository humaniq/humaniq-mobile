import { Modal as M } from "react-native-paper"
import { ModalProps } from "ui/components/modal/types"
import { useStyles } from "./styles"

export const Modal = (props: ModalProps) => {
  const style = useStyles()

  return <M { ...props } contentContainerStyle={ [ style.root, props.style ] } />
}
