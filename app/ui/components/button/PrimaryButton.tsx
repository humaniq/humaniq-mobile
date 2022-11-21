import { Text, TouchableOpacity } from "react-native"
import { PrimaryButtonProps } from "./types"
import { useStyles } from "./styles"
import { useTheme } from "hooks/useTheme"
import { MovIcon } from "ui/components/icon/MovIcon"

export const PrimaryButton = ({
                                title,
                                onPress,
                                disabled,
                                style,
                                icon,
                                iconStyles,
                                textStyle,
                              }: PrimaryButtonProps) => {
  const styles = useStyles()
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      disabled={ disabled }
      style={ [ styles.root,
        {
          backgroundColor: disabled ? colors.disabled : colors.primaryButton,
        },
        style,
      ] }
      onPress={ onPress }>
      { icon ? (
        <MovIcon
          { ...iconStyles }
          name={ icon }
        />
      ) : null }
      { title ? (
        <Text
          ellipsizeMode={ "tail" }
          numberOfLines={ 1 }
          style={ [
            styles.text,
            {
              color: disabled ? colors.disabledText : colors.white,
            },
            textStyle,
          ] }>
          { title }
        </Text>
      ) : null }
    </TouchableOpacity>
  )
}
