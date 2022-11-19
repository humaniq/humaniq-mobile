import { MoverImageProps } from "./types"
import { useStyles } from "./styles"
import FastImage from "react-native-fast-image"
import { useState } from "react"
import { View } from "react-native"

export const MoverImage = ({
                             imageStyle,
                             subImageStyle,
                             source,
                             subSource,
                             resizeMode = FastImage.resizeMode.contain,
                           }: MoverImageProps) => {
  const styles = useStyles()
  const [ loading, setLoading ] = useState(false)

  return (
    <View style={ styles.root }>
      <FastImage
        style={ imageStyle }
        source={ source }
        resizeMode={ resizeMode }
        onLoadStart={ () => setLoading(true) }
        onLoadEnd={ () => setLoading(false) }
      />
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
