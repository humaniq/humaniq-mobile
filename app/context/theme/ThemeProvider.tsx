import React, { createContext, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Languages, ThemeProviderProps, ThemeProviderValue, Themes } from './types'
import { DarkNightTheme, LightMorningTheme } from 'assets/themes'
import { loadString, saveString } from "utils/localStorage"
import { Appearance } from "react-native"
import i18n from "i18n-js"

export const STORAGE_APPLICATION_THEME = "application_theme"
export const STORAGE_APPLICATION_LANGUAGE = "application_language"

export const ThemeContext = createContext<ThemeProviderValue>(
  {} as ThemeProviderValue
)

const themeStore = {
  [Themes.Light]: LightMorningTheme,
  [Themes.Dark]: DarkNightTheme,
  [Themes.System]: Appearance.getColorScheme() === "dark" ? DarkNightTheme : LightMorningTheme
}

export const ThemeProvider = memo<ThemeProviderProps>(({
                                                         children,
                                                         initialThemeId = Themes.System,
                                                         initialLang = Languages.EN
                                                       }) => {
    const [themeId, setThemeId] = useState(initialThemeId)
    const [appLang, setAppLang] = useState(initialLang)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      ;(async () => {
        const [theme, language] = await Promise.all([
          await loadString(STORAGE_APPLICATION_THEME) as Themes | null,
          await loadString(STORAGE_APPLICATION_LANGUAGE) as Languages | null
        ])

        if (theme) {
          setThemeId(theme)
        }

        if (language) {
          i18n.locale = language
          setAppLang(language)
        }

        setLoading(false)
      })()
    }, [])

    const switchTheme = useCallback(async (tid: Themes) => {
      if (themeId !== tid) {
        setThemeId(tid)
        await saveString(STORAGE_APPLICATION_THEME, tid)
      }
    }, [setThemeId, saveString, themeId])

    const switchAppLang = useCallback(async (lang: string) => {
      if (i18n.locale !== lang) {
        i18n.locale = lang
        await saveString(STORAGE_APPLICATION_LANGUAGE, lang)
        setAppLang(lang)
      }
    }, [setAppLang, saveString, i18n.locale])

    const value = useMemo(
      () => ({
        store: themeStore[themeId],
        appLang,
        themeId,
        switchTheme,
        switchAppLang,
        isDarkMode: themeId === Themes.Dark,
        isLightMode: themeId === Themes.Light,
        isSystemMode: themeId === Themes.System
      }),
      [themeId, switchTheme, switchAppLang, appLang]
    )

    return (
      <ThemeContext.Provider value={ value }>{ loading ? null : children }</ThemeContext.Provider>
    )
  }
)
