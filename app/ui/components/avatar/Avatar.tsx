import { TouchableOpacity } from "react-native"
import { useStyles } from "./styles"
import { AvatarProps } from "./types"
import { useTheme } from "hooks/useTheme"
import { MovIcon } from "ui/components/icon/MovIcon"

export const Avatar = ({ containerStyle, onPress }: AvatarProps) => {
  const styles = useStyles()
  const { colors } = useTheme()

  return (
    <TouchableOpacity style={ [styles.root, containerStyle] } onPress={ onPress }>
      <MovIcon
        name={ "camera" }
        size={ 40 }
        color={ colors.avatar }
      />
    </TouchableOpacity>
  )
}
