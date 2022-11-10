import { PrimaryButtonProps } from "./types"
import { useStyles } from "./styles"
import { Text, TouchableOpacity } from "react-native"
import { useTheme } from "hooks/useTheme"

export const PrimaryButton = ({ title, onPress, disabled, style }: PrimaryButtonProps) => {
  const styles = useStyles()
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      disabled={ disabled }
      style={ [styles.root, {
        backgroundColor: disabled ? colors.disabled : colors.primaryButton
      }, style] }
      onPress={ onPress }>
      <Text style={ [styles.text, {
        color: disabled ? colors.disabledText : colors.white
      }] }>
        { title }
      </Text>
    </TouchableOpacity>
  )
}
