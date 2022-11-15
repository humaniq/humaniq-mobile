import { MIconProps } from "./types"
import { useMIconStyles } from "./styles"
import { TouchableOpacity } from "react-native"
import { MovIcon } from "ui/components/icon/MovIcon"

export const MIcon = ({
                        icon,
                        onPress,
                        size,
                        color,
                        containerStyle,
                      }: MIconProps) => {
  const styles = useMIconStyles()

  return (
    <TouchableOpacity
      style={ [ styles.root, containerStyle ] }
      disabled={ !onPress }
      onPress={ onPress }>
      <MovIcon
        name={ icon }
        size={ size }
        color={ color }
      />
    </TouchableOpacity>
  )
}
