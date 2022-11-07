import * as _ from 'underscore'
import { fontScale, horizontalScale, verticalScale } from 'utils/screenUtils'
import { StyleSheet } from 'react-native'

const adjustableProperties = {
  height: [
    'marginTop',
    'marginBottom',
    'marginVertical',
    'paddingTop',
    'paddingBottom',
    'paddingVertical',
    'top',
    'bottom',
    'height'
  ],
  width: [
    'marginLeft',
    'marginRight',
    'marginHorizontal',
    'paddingRight',
    'paddingLeft',
    'paddingHorizontal',
    'left',
    'right',
    'width'
  ],
  rest: [
    'borderWidth',
    'borderRadius',
    'shadowRadius',
    'padding',
    'margin',
    'fontSize',
    'lineHeight',
    'opacity'
  ]
}

export const ExtendedStyleSheet = <T>(styleSheet: any) => {
  _.each(styleSheet, selector => {
    _.each(selector, (value, property) => {
      const style = selector
      const containsVertical = _.includes(adjustableProperties.height, property)
      const containsHorizontal = _.includes(adjustableProperties.width, property)
      const containsRest = _.includes(adjustableProperties.rest, property)

      if (typeof style[property] === 'string') return

      if (containsVertical) {
        style[property] = verticalScale(value)
      } else if (containsHorizontal) {
        style[property] = horizontalScale(value)
      } else if (containsRest) {
        style[property] = fontScale(value)
      }
    })
  })
  return StyleSheet.create<T>(styleSheet)
}
