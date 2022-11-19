import React, { memo, useMemo } from "react"
import { Appearance, StatusBar, View } from "react-native"
import { AppStatusBarInterface } from "./types"
import { IS_ANDROID } from "utils/common"
import { useTheme } from "hooks/useTheme"

export const AppStatusBar = memo((props: AppStatusBarInterface) => {
  const { colors, isDarkMode, isSystemMode } = useTheme()

  const statusbarStyle = useMemo(() => {
    if (isDarkMode) {
      return "light-content"
    }

    if (isSystemMode) {
      return Appearance.getColorScheme() === "dark" ? "light-content" : "dark-content"
    }

    return "dark-content"
  }, [ isDarkMode, isSystemMode, Appearance.getColorScheme ])

  const {
    backgroundColor = colors.background,
    barStyle = statusbarStyle,
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
        backgroundColor: colors.background,
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
