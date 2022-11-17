import { TextInput, View } from "react-native"
import { useStyles } from "./styles"
import { SearchProps } from "./types"
import { useTheme } from "hooks/useTheme"
import { useState } from "react"
import { usePressBack } from "hooks/usePressBack"
import { MovIcon } from "ui/components/icon/MovIcon"

export const Search = ({ hint, containerStyle, style }: SearchProps) => {
  const [input, setInput] = useState("")
  const styles = useStyles()
  const { colors } = useTheme()

  usePressBack()

  return (
    <View style={ [styles.root, containerStyle] }>
      <MovIcon
        name={ "search" }
        color={ colors.searchIcon }
        size={ 22 }
      />
      <TextInput
        style={ [styles.input, style] }
        value={ input }
        onChangeText={ setInput }
        placeholder={ hint }
        placeholderTextColor={ colors.searchIcon }
      />
    </View>
  )
}
