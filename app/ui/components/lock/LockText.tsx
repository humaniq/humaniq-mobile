import { View } from "react-native"
import { LockTextProps } from "./types"
import { useStyles } from "./styles"
import { Text } from "react-native-paper"
import { MovIcon } from "ui/components/icon/MovIcon"

export const LockText = ({ text }: LockTextProps) => {
  const styles = useStyles()

  return (
    <View style={ styles.root }>
      <MovIcon
        name={ "lock" }
        size={ 26 }
        color={ "#B1B1B1" }/>
      <Text style={ styles.text }>
        { text }
      </Text>
    </View>
  )
}
