import { StyleSheet } from 'react-native'

export const ExtendedStyleSheet = <T>(styleSheet: any) => {
  return StyleSheet.create<T>(styleSheet)
}
