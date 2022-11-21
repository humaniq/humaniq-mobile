import { Text, TouchableOpacity } from "react-native"
import { PrimaryButtonProps } from "./types"
import { useStyles } from "./styles"
import { useTheme } from "hooks/useTheme"
import { MovIcon } from "ui/components/icon/MovIcon"
import { ActivityIndicator } from "react-native-paper"

export const PrimaryButton = ({
                                title,
                                onPress,
                                disabled,
                                style,
                                icon,
                                iconStyles,
                                pending,
                                textStyle,
                              }: PrimaryButtonProps) => {
  const styles = useStyles()
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      disabled={ disabled }
      style={ [ styles.root, {
        backgroundColor: disabled ? colors.disabled : colors.primaryButton,
      }, style ] }
      onPress={ !pending && onPress }>
      { icon && !pending ? (
        <MovIcon
          { ...iconStyles }
          name={ icon }
        />
      ) : null }
      { title && !pending ? (
        <Text
          ellipsizeMode={ "tail" }
          numberOfLines={ 1 }
          style={ [ styles.text, {
            color: disabled ? colors.disabledText : colors.white,
          }, textStyle ] }>
          { title }
        </Text>
      ) : null }
      { pending && <ActivityIndicator color={ styles.pendingColor.color } /> }
    </TouchableOpacity>
  )
}
