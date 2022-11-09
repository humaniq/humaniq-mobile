import { HeaderProps } from "./types"
import { View } from "react-native"
import { useStyles } from "./styles"
import { Text } from "react-native-paper"

export const Header = ({}: HeaderProps) => {
  const styles = useStyles()

  return (
    <View style={ styles.root }>
      <Text style={styles.title}>

      </Text>
    </View>
  )
}
