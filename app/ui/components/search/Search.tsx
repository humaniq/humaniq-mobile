import { ActivityIndicator, TextInput, View } from "react-native"
import { useStyles } from "./styles"
import { SearchProps } from "./types"
import { useTheme } from "hooks/useTheme"
import React, { memo, useCallback, useState } from "react"
import { usePressBack } from "hooks/usePressBack"
import { MovIcon } from "ui/components/icon/MovIcon"

export const Search = memo(({
                              hint,
                              containerStyle,
                              style,
                              onChangeText,
                              loading,
                            }: SearchProps) => {
  const [ input, setInput ] = useState("")
  const styles = useStyles()
  const { colors } = useTheme()

  usePressBack(() => true)

  const handleTextChange = useCallback((text: string) => {
    setInput(text)
    onChangeText?.(text)
  }, [ onChangeText, setInput ])

  return (
    <View style={ [ styles.root, containerStyle ] }>
      <MovIcon
        name={ "search" }
        color={ colors.searchIcon }
        size={ 22 }
      />
      <TextInput
        style={ [ styles.input, style ] }
        value={ input }
        onChangeText={ handleTextChange }
        placeholder={ hint }
        placeholderTextColor={ colors.searchIcon }
        numberOfLines={ 1 }
        multiline={ false }
      />
      { loading && (
        <ActivityIndicator
          color={ colors.black }
          size={ 40 }
        />
      ) }
    </View>
  )
})
