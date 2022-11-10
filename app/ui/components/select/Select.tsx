import { SelectItem, SelectProps } from "./types"
import { useStyles } from "./styles"
import { Text, TouchableOpacity, View } from "react-native"
import React, { useCallback, useState } from "react"
import { Menu } from "react-native-paper"
import { MovIcon } from "ui/components/icon"
import { useTheme } from "hooks/useTheme"

export const Select = ({ header, containerStyle, description, data = [], onItemClick }: SelectProps) => {
  const [visible, setVisible] = useState(false)
  const styles = useStyles()
  const { colors } = useTheme()

  const handleSelectItemClick = useCallback((item: SelectItem) => {
    onItemClick?.(item)
  }, [])

  return (
    <View style={ [styles.root, containerStyle] }>
      { header ? (
        <Text style={ styles.header }>{ header }</Text>
      ) : null }
      <Menu
        contentStyle={ styles.dropdown }
        visible={ visible }
        onDismiss={ () => {
          setVisible(false)
        } }
        anchor={
          <TouchableOpacity style={ styles.select } onPress={ () => setVisible(true) }>
            <Text style={ styles.selectText }>{ data.length > 0 && data[0].title }</Text>
            <MovIcon
              name={ "select_arrows" }
              size={ 16 }
              color={ colors.headerTitle }
            />
          </TouchableOpacity>
        }>
        { data.map((item, index) => (
          <Menu.Item
            titleStyle={ styles.dropdownText }
            key={ item.title }
            onPress={ () => handleSelectItemClick(item) }
            title={ item.title }
          />
        )) }
      </Menu>
      { description ? (
        <Text style={ styles.description }>{ description }</Text>
      ) : null }
    </View>
  )
}
