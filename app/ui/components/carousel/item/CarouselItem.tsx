import { CarouselItemProps } from "./types"
import { useStyles } from "./styles"
import { Image, Text, TouchableOpacity } from "react-native"
import { getNetwork } from "../../../../references/references"

export const CarouselItem = ({
                               selected,
                               style,
                               onPress,
                               item,
                             }: CarouselItemProps) => {
  const styles = useStyles()

  return (
    <TouchableOpacity
      onPress={ onPress }
      style={ [
        styles.root,
        selected && styles.selected,
        style,
      ] }>
      <Image
        source={ getNetwork(item).iconURL }
        style={ styles.icon }
      />
      <Text
        ellipsizeMode={ "tail" }
        numberOfLines={ 1 }
        style={ [
          styles.text,
          selected && styles.selectedText,
        ] }>{ getNetwork(item).displayedName }</Text>
    </TouchableOpacity>
  )
}
