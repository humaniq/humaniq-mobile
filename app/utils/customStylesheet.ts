import { StyleSheet } from 'react-native'
//
// const adjustableProperties = {
//   height: [
//     'marginTop',
//     'marginBottom',
//     'marginVertical',
//     'paddingTop',
//     'paddingBottom',
//     'paddingVertical',
//     'top',
//     'bottom',
//     'height'
//   ],
//   width: [
//     'marginLeft',
//     'marginRight',
//     'marginHorizontal',
//     'paddingRight',
//     'paddingLeft',
//     'paddingHorizontal',
//     'left',
//     'right',
//     'width'
//   ],
//   rest: [
//     'borderWidth',
//     'borderRadius',
//     'shadowRadius',
//     'padding',
//     'margin',
//     'fontSize',
//     'lineHeight',
//     'opacity'
//   ]
// }

export const ExtendedStyleSheet = <T>(styleSheet: any) => StyleSheet.create<T>(styleSheet)
