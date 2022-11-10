import React from "react"
import { Text, TextInput, View } from "react-native"
import { InputProps } from "./types"
import { useStyles } from "./styles"
import { useTheme } from "hooks/useTheme"

export const Input = ({ title, containerStyle, style, hint }: InputProps) => {
  const styles = useStyles()
  const { colors } = useTheme()

  return (
    <View style={ [styles.root, containerStyle] }>
      { title ? (
        <Text style={ styles.title }>{ title }</Text>
      ) : null }
      <TextInput
        style={ [styles.input, style] }
        placeholder={ hint }
        placeholderTextColor={ colors.placeholder }
      />
    </View>
  )
}
