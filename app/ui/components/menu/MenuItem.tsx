import React from "react"
import { MenuItemProps } from "./types"
import { TouchableOpacity, View, Text } from "react-native"
import { useStyles } from "./styles"
import { MovIcon } from "ui/components/icon/MovIcon"
import { useTheme } from "hooks/useTheme"
import { RoundedIcon } from "ui/components/icon/RoundedIcon"
import { t } from "../../../i18n/translate"

export const MenuItem = ({
                           icon,
                           title,
                           subTitle,
                           arrowRight = false,
                           comingSoon = false,
                           onPress,
                           disabled,
                         }: MenuItemProps) => {
  const styles = useStyles()
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      style={ styles.root }
      disabled={ disabled }
      onPress={ onPress }>
      <View style={ [ styles.content, {
        opacity: disabled ? 0.5 : 1,
      } ] }>
        <RoundedIcon icon={ icon } />
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
            color={ colors.primary }
          />
        ) }
      </View>
      { comingSoon && (
        <View style={ styles.comingSoon }>
          <Text style={ styles.comingSoonText }>{ t("soon") }</Text>
        </View>
      ) }
    </TouchableOpacity>
  )
}
