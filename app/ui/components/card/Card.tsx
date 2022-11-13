import { CardProps } from "./types"
import { useStyles } from "./styles"
import { View } from "react-native"

export const Card = ({}: CardProps) => {
  const styles = useStyles()

  return (
    <View style={ styles.root }>

    </View>
  )
}
