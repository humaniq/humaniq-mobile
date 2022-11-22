import { PrimaryTextProps } from "./types"
import { useTextStyles } from "./styles"
import { Text } from "react-native"

export const PrimaryText = ({ text, style }: PrimaryTextProps) => {
  const styles = useTextStyles()

  return (
    <Text style={ [ styles.root, style ] }>{ text }</Text>
  )
}
