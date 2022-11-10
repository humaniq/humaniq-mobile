import { HeaderProps } from "./types"
import { Text, TouchableOpacity, View } from "react-native"
import { useStyles } from "./styles"
import { MovIcon } from "ui/components/icon"
import { useTheme } from "hooks/useTheme"

export const Header = ({ title = "Title", isSettings, back = true, containerStyle }: HeaderProps) => {
  const styles = useStyles()
  const { colors } = useTheme()

  return (
    <View style={ [styles.root, containerStyle] }>
      { back && (
        <TouchableOpacity style={ styles.back }>
          <MovIcon
            name={ "arrow_left" }
            size={ 25 }
            color={ colors.primary }/>
        </TouchableOpacity>
      ) }
      { title ? (
        <Text
          numberOfLines={ 1 }
          ellipsizeMode={ "tail" }
          style={ styles.title }>{ title }</Text>
      ) : null }
      { isSettings ? (
        <TouchableOpacity style={ styles.settings }>
          <MovIcon
            name={ "settings" }
            size={ 25 }
            color={ colors.primary }/>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={ styles.close }>
          <MovIcon
            name={ "close" }
            size={ 27 }
            color={ colors.primary }/>
        </TouchableOpacity>
      ) }
    </View>
  )
}
