import { createIconSetFromIcoMoon } from "react-native-vector-icons"
import config from "mover-icon-set/selection.json"
import { MovIconProps } from "./types"
import { useStyles } from "./styles"

export const Icon = createIconSetFromIcoMoon(config)

export const MovIcon = ({ name, size, color, style }: MovIconProps) => {
  const styles = useStyles()

  return (
    <Icon
      name={ name }
      size={ size }
      color={ color }
      style={ [ styles.root, style ] }
    />
  )
}
