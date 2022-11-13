import { Text, TouchableOpacity } from "react-native"
import { LinkTextProps } from "./types"
import { useLinkTextStyles } from "./styles"

export const LinkText = ({ text, onPress }: LinkTextProps) => {
  const styles = useLinkTextStyles()

  return (
    <TouchableOpacity style={ styles.root } onPress={ onPress }>
      <Text style={ styles.text }>{ text }</Text>
    </TouchableOpacity>
  )
}
