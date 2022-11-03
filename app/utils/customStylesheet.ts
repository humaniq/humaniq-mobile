import * as _ from 'underscore';
import { scalePx } from 'utils/screenUtils'
import { StyleSheet } from 'react-native';

const adjustableProperties = {
  width: [
    'marginLeft',
    'marginRight',
    'marginHorizontal',
    'paddingRight',
    'paddingLeft',
    'paddingHorizontal',
    'left',
    'right',
    'width',
  ],
  height: [
    'marginTop',
    'marginBottom',
    'marginVertical',
    'paddingTop',
    'paddingBottom',
    'paddingVertical',
    'top',
    'bottom',
    'height',
  ],
  rest: [
    'borderWidth',
    'borderRadius',
    'shadowRadius',
    'padding',
    'margin',
    'fontSize',
    'lineHeight',
    'opacity',
  ],
};

export const ExtendedStyleSheet = <T>(styleSheet: any) => {
  _.each(styleSheet, selector => {
    _.each(selector, (value, property) => {
      const style = selector;
      const containsHeight = _.includes(adjustableProperties.height, property);
      const containsWidth = _.includes(adjustableProperties.width, property);
      const containsRest = _.includes(adjustableProperties.rest, property);

      if (containsHeight || containsWidth || containsRest) {
        if (typeof style[property] !== 'string') {
          style[property] = scalePx(value);
        }
      }
    });
  });
  return StyleSheet.create<T>(styleSheet);
};
