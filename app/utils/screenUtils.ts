import { Dimensions, Platform } from 'react-native'

const { width, height } = Dimensions.get('window')

const guidelineBaseWidth = 375
const guidelineBaseHeight = 812

const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size
const scale = (size, factor = Platform.OS === 'ios' ? 1.5 : 0.4) => size + (horizontalScale(size) - size) * factor

export { horizontalScale, verticalScale, scale }
