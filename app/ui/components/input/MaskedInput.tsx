import React from "react"
import { ActivityIndicator, Text, View } from "react-native"
import { MaskedInputProps } from "./types"
import { useMaskedInputStyles } from "./styles"
import { useTheme } from "hooks/useTheme"
import TextInputMask from 'react-native-text-input-mask'

export const MaskedInput = ({
                              title,
                              containerStyle,
                              style,
                              placeholder,
                              onChange,
                              mask,
                              loading
                            }: MaskedInputProps) => {
  const styles = useMaskedInputStyles()
  const { colors } = useTheme()

  return (
    <View style={ [styles.root, containerStyle] }>
      { title ? (
        <Text style={ styles.title }>{ title }</Text>
      ) : null }
      <View>
        <TextInputMask
          mask={ mask }
          style={ Object.assign(styles.input, style) }
          placeholder={ placeholder }
          placeholderTextColor={ colors.placeholder }
          onChangeText={ (text, rawText) => {
            onChange?.(text, rawText)
          } }
          autoCapitalize="none"
          autoComplete="off"
        />
        { loading && (
          <ActivityIndicator
            style={ styles.loading }
            color={ colors.primary }
          />
        ) }
      </View>
    </View>
  )
}
