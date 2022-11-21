import { DividerProps } from "./types"
import { useStyles } from "./styles"
import { View } from "react-native"

export const Divider = ({ style }: DividerProps) => {
  const styles = useStyles()

  return (
    <View style={ [ styles.root, style ] } />
  )
}
