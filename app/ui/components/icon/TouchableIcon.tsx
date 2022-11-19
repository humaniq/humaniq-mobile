import { TouchableIconProps } from "./types"
import { useTouchableIconStyles } from "./styles"
import { TouchableOpacity } from "react-native"
import { MovIcon } from "ui/components/icon/MovIcon"

export const TouchableIcon = ({
                                icon,
                                onPress,
                                size,
                                color,
                                containerStyle,
                              }: TouchableIconProps) => {
  const styles = useTouchableIconStyles()

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
