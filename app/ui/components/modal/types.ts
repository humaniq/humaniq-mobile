import React from "react"
import { StyleProp, ViewStyle } from "react-native"

export interface ModalProps {
  visible: boolean
  onDismiss?: () => void;
  children: React.ReactNode
  style?: StyleProp<ViewStyle>;
}
