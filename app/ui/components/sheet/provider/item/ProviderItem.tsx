import { Text, TouchableOpacity } from "react-native"
import { ItemProps } from "./types"
import { useStyles } from "./styles"

export const ProviderItem = ({
                               title,
                               icon,
                               onPress,
                               style,
                               disabled,
                             }: ItemProps) => {
  const styles = useStyles()

  return (
    <TouchableOpacity
      disabled={ disabled }
      style={ [ styles.root, style, {
        opacity: disabled ? 0.5 : 1,
      } ] }
      onPress={ onPress }>
      <Text
        ellipsizeMode={ "tail" }
        numberOfLines={ 1 }
        style={ styles.title }>{ title }</Text>
      { icon }
    </TouchableOpacity>
  )
}
