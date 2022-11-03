import { Dimensions } from 'react-native'
import DeviceInfo from 'react-native-device-info'

export const isTablet = (): boolean => DeviceInfo.isTablet()

const DESIGN_WIDTH = 410

export const getWindowWidth = (): number => Dimensions.get('window').width

export const getWindowHeight = (): number => Dimensions.get('window').height

const getActualDeviceWidth = (): number => {
  let actualWidth = getWindowWidth()

  if (actualWidth > DESIGN_WIDTH) {
    actualWidth = 380
  }

  return actualWidth
}

export const isLandscape = (): boolean => {
  if (!isTablet()) {
    return false
  }
  return DeviceInfo.isLandscapeSync()
}

export const scalePx = (px: number): number =>
  px * (getActualDeviceWidth() / DESIGN_WIDTH)

export const getWidthRatio = (): number =>
  getActualDeviceWidth() / DESIGN_WIDTH
