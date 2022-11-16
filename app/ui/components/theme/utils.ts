import { convertToHSVA, toRGBA } from "react-native-reanimated/src/reanimated2/Colors"

export function toRGBAColor(color,opacity ){
  const hsva = convertToHSVA(color)
  hsva[3] = opacity
  return toRGBA(hsva)
}
