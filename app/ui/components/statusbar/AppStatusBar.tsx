import React, { memo } from 'react'
import { StatusBar, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AppStatusBarInterface } from './types'
import { IS_ANDROID } from 'utils/common'
import { useTheme } from 'hooks/useTheme'

export const AppStatusBar = memo((props: AppStatusBarInterface) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()

  const {
    backgroundColor = theme.colors.statusBar,
    barStyle = 'dark-content',
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
        backgroundColor,
        height: insets.top
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
