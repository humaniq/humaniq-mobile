import { View } from "react-native"
import { LockTextProps } from "./types"
import { useIconTextStyles } from "./styles"
import { Text } from "react-native-paper"
import { useTheme } from "hooks/useTheme"
import { MovIcon } from "ui/components/icon/MovIcon"

export const IconText = ({ text, icon }: LockTextProps) => {
  const styles = useIconTextStyles()
  const { colors } = useTheme()

  return (
    <View style={ styles.root }>
      <MovIcon
        name={ icon }
        size={ 26 }
        color={ colors.sub }/>
      <Text style={ styles.text }>
        { text }
      </Text>
    </View>
  )
}
