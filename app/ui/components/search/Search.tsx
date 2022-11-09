import { TextInput, View } from "react-native"
import { useStyles } from "./styles"
import { SearchProps } from "./types"
import { MovIcon } from "ui/components/icon"
import { useTheme } from "hooks/useTheme"
import { useState } from "react"

export const Search = ({}: SearchProps) => {
  const [input, setInput] = useState("")
  const styles = useStyles()
  const { colors } = useTheme()

  return (
    <View style={ styles.root }>
      <MovIcon
        name={ "search" }
        color={ colors.searchIcon }
        size={ 24 }
      />
      <TextInput
        style={ styles.input }
        value={ input }
        onChangeText={ setInput }
      />
    </View>
  )
}
