import { Props } from "./types"
import { useStyles } from "./styles"
import { Text, TouchableOpacity, View } from "react-native"
import React from "react"
import { MoverImage } from "ui/components/image/MoverImage"
import { getNetwork } from "../../../references/references"

export const TokenInfo = ({
                            onPress,
                            containerStyle,
                            token,
                          }: Props) => {
  const styles = useStyles()

  return (
    <TouchableOpacity
      style={ [ styles.root, containerStyle ] }
      onPress={ onPress }>
      <View style={ styles.imageContainer }>
        <MoverImage
          imageStyle={ styles.image }
          subImageStyle={ styles.imageMini }
          source={ {
            uri: token.iconURL,
          } }
          subSource={ getNetwork(token.network).iconURL }
          fallbackText={ token.symbol }
        />
      </View>
      <View style={ styles.middle }>
        <Text
          numberOfLines={ 1 }
          ellipsizeMode={ "tail" }
          style={ styles.title }>{ token.name }</Text>
        <Text
          numberOfLines={ 1 }
          ellipsizeMode={ "tail" }
          style={ styles.subTitle }>{ token.symbol }</Text>
      </View>
      <Text style={ styles.cost }>
        ${ token.priceUSD }
      </Text>
    </TouchableOpacity>
  )
}
