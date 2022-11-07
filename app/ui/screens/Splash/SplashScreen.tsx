import { SplashScreenProps } from "./types"
import { useStyles } from "./styles"
import { View } from "react-native"

export const SplashScreen = ({}: SplashScreenProps) => {
  const styles = useStyles()

  return (
    <View style={ styles.root }>

    </View>
  )
}
