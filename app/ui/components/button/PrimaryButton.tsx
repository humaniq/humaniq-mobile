import { Text, TouchableOpacity } from "react-native"
import { PrimaryButtonProps } from "./types"
import { useStyles } from "./styles"
import { useTheme } from "hooks/useTheme"
import { MovIcon } from "ui/components/icon"

export const PrimaryButton = ({ title, onPress, disabled, style, icon }: PrimaryButtonProps) => {
  const styles = useStyles()
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      disabled={ disabled }
      style={ [ styles.root, {
        backgroundColor: disabled ? colors.disabled : colors.primaryButton,
      }, style ] }
      onPress={ onPress }>
      <MovIcon name={ icon } />
      <Text
        ellipsizeMode={ "tail" }
        numberOfLines={ 1 }
        style={ [ styles.text, {
        color: disabled ? colors.disabledText : colors.white,
      } ] }>
        { title }
      </Text>
    </TouchableOpacity>
  )
}
