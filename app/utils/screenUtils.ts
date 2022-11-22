import { Dimensions, Platform, PixelRatio } from 'react-native'

const { width, height } = Dimensions.get('window')

const ratio: number = PixelRatio.getFontScale()

const guidelineBaseWidth = 375
const guidelineBaseHeight = 812

const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size
const scale = (size, factor = Platform.OS === 'ios' ? 1.5 : 0.1) => size + (horizontalScale(size) - size) * factor

export const scaleFontSize = (fontSize: number = 1): number => {
  const divisionRatio: number = guidelineBaseHeight / (fontSize / ratio)
  return height / divisionRatio
}

export { horizontalScale, verticalScale, scale }
