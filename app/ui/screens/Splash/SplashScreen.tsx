import { SplashScreenProps } from "./SplashScreen.types"
import { useStyles } from "./SplashScreen.styles"
import { View } from "react-native"

export const SplashScreen = ({}: SplashScreenProps) => {
  const styles = useStyles();

  return (
    <View style={styles.root}>

    </View>
  )
}
