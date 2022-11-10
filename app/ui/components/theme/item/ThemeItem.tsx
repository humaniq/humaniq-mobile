import { ThemeItemProps } from "./types"
import { useStyles } from "./styles"
import { Text, TouchableOpacity } from "react-native"
import { useTheme } from "hooks/useTheme"
import { MovIcon } from "ui/components/icon"

export const ThemeItem = ({ title, selected, icon, onPress, selectedIcon = "theme_selected" }: ThemeItemProps) => {
  const styles = useStyles()
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      onPress={ onPress }
      style={ [styles.root, selected && {
        backgroundColor: colors.white
      }] }>
      <MovIcon
        name={ selected ? selectedIcon : icon }
        size={ 24 }
        color={ selected ? colors.primaryButton : colors.themeIcon }
      />
      <Text style={ [styles.title, {
        color: selected ? "#333333" : colors.headerTitle
      }] }>{ title }</Text>
    </TouchableOpacity>
  )
}
