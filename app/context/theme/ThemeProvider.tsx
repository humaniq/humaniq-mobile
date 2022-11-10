import React, { createContext, memo, useCallback, useMemo, useState } from 'react'
import { ThemeProviderProps, ThemeProviderValue, Themes } from './types'
import { DarkNightTheme, LightMorningTheme } from 'assets/themes'

export const ThemeContext = createContext<ThemeProviderValue>(
  {} as ThemeProviderValue
)

const themeStore = {
  [Themes.Light]: LightMorningTheme,
  [Themes.Dark]: DarkNightTheme,
  [Themes.System]: LightMorningTheme
}

export const ThemeProvider = memo<ThemeProviderProps>(
  ({ children, initialThemeId = Themes.System }) => {
    const [themeId, setThemeId] = useState(initialThemeId)
    const switchTheme = useCallback((tid: Themes) => {
      setThemeId(tid)
    }, [])

    const value = useMemo(
      () => ({
        store: themeStore[themeId],
        themeId,
        switchTheme,
        isDarkMode: themeId === Themes.Dark
      }),
      [themeId, switchTheme]
    )

    return (
      <ThemeContext.Provider value={ value }>{ children }</ThemeContext.Provider>
    )
  }
)
