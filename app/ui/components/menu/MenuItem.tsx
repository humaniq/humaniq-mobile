import React from "react"
import { MenuItemProps } from "./types"
import { Text, TouchableOpacity, View } from "react-native"
import { useStyles } from "./styles"
import { RoundedIcon } from "../rounded/RoundedIcon"
import { MovIcon } from "ui/components/icon"
import { useTheme } from "hooks/useTheme"

export const MenuItem = ({
                           icon,
                           title,
                           subTitle,
                           arrowRight = false,
                           comingSoon = false,
                           onPress
                         }: MenuItemProps) => {
  const styles = useStyles()
  const { colors } = useTheme()

  return (
    <TouchableOpacity style={ styles.root } onPress={ onPress }>
      <RoundedIcon icon={ icon }/>
      <View style={ styles.middle }>
        <Text
          numberOfLines={ 1 }
          ellipsizeMode={ "tail" }
          style={ styles.title }>{ title }</Text>
        <Text
          numberOfLines={ 1 }
          ellipsizeMode={ "tail" }
          style={ styles.subTitle }>{ subTitle }</Text>
      </View>
      { arrowRight && (
        <MovIcon
          name={ "arrow_right" }
          size={ 26 }
          color={ colors.roundedIcon }/>
      ) }
      { comingSoon && (
        <View style={ styles.comingSoon }>
          <Text style={ styles.comingSoonText }>Coming soon</Text>
        </View>
      ) }
    </TouchableOpacity>
  )
}
