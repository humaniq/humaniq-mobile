import { SelectItem, SelectProps } from "./types"
import { useStyles } from "./styles"
import { Text, TouchableOpacity, View } from "react-native"
import React, { useCallback, useState } from "react"
import { Menu } from "react-native-paper"
import { useTheme } from "hooks/useTheme"
import { MovIcon } from "ui/components/icon/MovIcon"

export const Select = ({
                         header,
                         containerStyle,
                         description,
                         data = [],
                         onItemClick,
                         placeholder,
                         selectedValue
                       }: SelectProps) => {
  const [visible, setVisible] = useState(false)
  const styles = useStyles()
  const { colors } = useTheme()

  const handleSelectItemClick = useCallback((item: SelectItem) => {
    onItemClick?.(item)
    setVisible(false)
  }, [onItemClick, setVisible])

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
            <Text style={ styles.selectText }>{ selectedValue ? selectedValue.title : placeholder }</Text>
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
            key={ item?.title }
            onPress={ () => handleSelectItemClick(item) }
            title={ item?.title }
          />
        )) }
      </Menu>
      { description ? (
        <Text style={ styles.description }>{ description }</Text>
      ) : null }
    </View>
  )
}
