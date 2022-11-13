import { HeaderProps } from "./types"
import { Text, TouchableOpacity, View } from "react-native"
import { useStyles } from "./styles"
import { useTheme } from "hooks/useTheme"
import { MovIcon } from "ui/components/icon/MovIcon"

export const Header = ({ title, isSettings, back = true, containerStyle }: HeaderProps) => {
  const styles = useStyles()
  const { colors } = useTheme()

  return (
    <View style={ [styles.root, containerStyle, {
      justifyContent: !back && !title ? "flex-end" : "space-between"
    }] }>
      { back && (
        <TouchableOpacity style={ styles.back }>
          <MovIcon
            name={ "arrow_left" }
            size={ 25 }
            color={ colors.primary }
          />
        </TouchableOpacity>
      ) }
      { title ? (
        <Text
          numberOfLines={ 1 }
          ellipsizeMode={ "tail" }
          style={ [styles.title, {
            textAlign: back ? "center" : "left"
          }] }>{ title }</Text>
      ) : null }
      <TouchableOpacity style={ isSettings ? styles.settings : styles.close }>
        <MovIcon
          name={ isSettings ? "settings" : "close" }
          size={ 27 }
          color={ colors.primary }
        />
      </TouchableOpacity>
    </View>
  )
}
