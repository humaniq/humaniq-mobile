import { HeaderProps } from "./types"
import { Text, TouchableOpacity, View } from "react-native"
import { useStyles } from "./styles"
import { MovIcon } from "ui/components/icon/MovIcon"
import { useTheme } from "hooks/useTheme"
import { useNavigation, useRoute } from "@react-navigation/native"
import { SCREENS } from "navigation/path"

export const Header = ({ title, isSettings, back = true, containerStyle }: HeaderProps) => {
  const styles = useStyles()
  const { colors } = useTheme()
  const nav = useNavigation()
  const state = useRoute()

  return (
    <View style={ [ styles.root, containerStyle ] }>
      { back && (
        <TouchableOpacity style={ styles.back }>
          <MovIcon
            name={ "arrow_left" }
            size={ 25 }
            color={ colors.primary } />
        </TouchableOpacity>
      ) }
      { title ? (
        <Text
          numberOfLines={ 1 }
          ellipsizeMode={ "tail" }
          style={ styles.title }>{ title }</Text>
      ) : null }
      { isSettings ? (
        <TouchableOpacity
          onPress={ () => nav.navigate(SCREENS.SETTINGS_SCREEN) }
          style={ styles.settings }>
          <MovIcon
            name={ "settings" }
            size={ 25 }
            color={ colors.primary }
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={ styles.close }
          onPress={ () => state.name === SCREENS.SETTINGS_SCREEN ? nav.navigate(SCREENS.CARD_SCREEN) : nav.goBack() }
        >
          <MovIcon
            name={ "close" }
            size={ 27 }
            color={ colors.primary }
          />
        </TouchableOpacity>
      ) }
    </View>
  )
}
