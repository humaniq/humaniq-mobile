import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const guidelineBaseWidth = 375
const guidelineBaseHeight = 812

const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size
const fontScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor

export { horizontalScale, verticalScale, fontScale }
