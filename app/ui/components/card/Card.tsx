import { CardProps } from "./types"
import { useStyles } from "./styles"
import { Image, Text, View } from "react-native"

export const Card = ({ skin }: CardProps) => {
  const styles = useStyles()

  return (
    <View style={ styles.root }>
      <Image
        source={ skin }
        style={ styles.skin }
      />
      <View style={styles.footer}>
        <Text style={styles.tag}>$anton</Text>
        <Text style={styles.tag}>VISA</Text>
      </View>
    </View>
  )
}
