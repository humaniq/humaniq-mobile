import { ImageRequireSource, StyleProp } from "react-native"
import { ImageStyle, ResizeMode, Source } from "react-native-fast-image"

export interface MoverImageProps {
  imageStyle?: StyleProp<ImageStyle>
  subImageStyle?: StyleProp<ImageStyle>
  source?: Source | ImageRequireSource
  resizeMode?: ResizeMode
  subSource?: Source | ImageRequireSource
  fallbackText?: string
}
