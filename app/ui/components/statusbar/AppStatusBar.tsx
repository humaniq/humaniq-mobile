import React, { memo } from 'react'
import { StatusBar, View } from 'react-native'
import { AppStatusBarInterface } from './types'
import { IS_ANDROID } from 'utils/common'
import { useTheme } from 'hooks/useTheme'

export const AppStatusBar = memo((props: AppStatusBarInterface) => {
  const { colors, isDarkMode } = useTheme()

  const {
    backgroundColor = colors.bg,
    barStyle = isDarkMode ? 'light-content' : 'dark-content',
    animated,
    ...otherProps
  } = props

  if (IS_ANDROID) {
    return (
      <StatusBar
        animated={ animated }
        barStyle={ barStyle }
        backgroundColor={ backgroundColor }
        { ...otherProps }
      />
    )
  }

  return (
    <View
      style={ {
        backgroundColor
      } }>
      <StatusBar
        animated={ animated }
        barStyle={ barStyle }
        translucent
        { ...otherProps }
      />
    </View>
  )
})
