import React from "react"
import { Snackbar } from "react-native-paper"
import { useInstance } from "react-ioc"
import { makeAutoObservable } from "mobx"
import { useStyles } from "./styles"
import { ExpectedError } from "utils/error/ExpectedError"
import { UnexpectedError } from "utils/error/UnexpectedError"

export class ToastViewModel {
  visible = false
  message = ""

  setToast = (val) => {
    this.visible = val
  }

  auto = (message: string | ExpectedError | UnexpectedError) => {
    if (message instanceof ExpectedError || message instanceof UnexpectedError) {
      this.message = message.message
    } else {
      this.message = message
    }
    this.visible = true
    setTimeout(() => {
      this.visible = false
      this.message = ""
    }, 3000)
  }

  constructor() {
    makeAutoObservable(this)
  }

}

export const Toast = () => {

  const view = useInstance(ToastViewModel)
  const style = useStyles()

  return <Snackbar style={ style }
                   wrapperStyle={ { marginBottom: 20 } }
                   onDismiss={ () => view.setToast(false) }
                   visible={ view?.visible }>
    { view.message }
  </Snackbar>
}
