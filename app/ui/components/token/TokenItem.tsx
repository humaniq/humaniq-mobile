import { Props } from "./types"
import { useStyles } from "./styles"
import { Text, TouchableOpacity, View } from "react-native"
import React from "react"

export const TokenItem = ({
                            onPress,
                            containerStyle,
                            token,
                          }: Props) => {
  const styles = useStyles()

  return (
    <TouchableOpacity
      style={ [ styles.root, containerStyle ] }
      onPress={ onPress }>

      <View style={ styles.image }>

      </View>

      <View style={ styles.middle }>
        <Text
          numberOfLines={ 1 }
          ellipsizeMode={ "tail" }
          style={ styles.title }>{ "Mover" }</Text>
        <Text
          numberOfLines={ 1 }
          ellipsizeMode={ "tail" }
          style={ styles.subTitle }>{ "MOVE" }</Text>
      </View>
    </TouchableOpacity>
  )
}
