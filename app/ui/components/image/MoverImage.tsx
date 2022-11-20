import { MoverImageProps } from "./types"
import { useStyles } from "./styles"
import FastImage from "react-native-fast-image"
import { useState } from "react"
import { Text, View } from "react-native"

export const MoverImage = ({
                             imageStyle,
                             subImageStyle,
                             source,
                             subSource,
                             resizeMode = FastImage.resizeMode.contain,
                             fallbackText,
                           }: MoverImageProps) => {
  const styles = useStyles()
  const [ loading, setLoading ] = useState(false)

  return (
    <View style={ styles.root }>
      { source ? (
        <FastImage
          style={ imageStyle }
          source={ source }
          resizeMode={ resizeMode }
          onLoadStart={ () => setLoading(true) }
          onLoadEnd={ () => setLoading(false) }
        />
      ) : (
        <View style={ [ styles.placeholder, imageStyle ] }>
          <Text
            ellipsizeMode={ "tail" }
            style={ styles.placeholderText }
            numberOfLines={ 1 }>{ fallbackText }</Text>
        </View>
      ) }
      { subSource && (
        <FastImage
          style={ subImageStyle }
          source={ subSource }
          resizeMode={ resizeMode }
          onLoadStart={ () => setLoading(true) }
          onLoadEnd={ () => setLoading(false) }
        />
      ) }
    </View>
  )
}
