import { TokenItemProps } from "./types"
import { useStyles } from "./styles"
import { Image, Text, TouchableOpacity } from "react-native"

export const TokenItem = ({ selected, style, onPress, item }: TokenItemProps) => {
  const styles = useStyles()

  return (
    <TouchableOpacity
      onPress={ onPress }
      style={ [ styles.root, selected && styles.selected ] }>
      <Image
        source={ item.iconURL as any }
        style={ styles.icon }
      />
      <Text
        ellipsizeMode={ "tail" }
        numberOfLines={ 1 }
        style={ styles.text }>{ item.displayedName }</Text>
    </TouchableOpacity>
  )
}
