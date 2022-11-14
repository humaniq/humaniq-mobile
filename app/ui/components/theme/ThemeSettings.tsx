import { ScrollView, Text, View } from "react-native"
import { ThemeSettingsProps } from "./types"
import { useStyles } from "./styles"
import { ThemeItem } from "ui/components/theme/item/ThemeItem"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useTheme } from "hooks/useTheme"
import { Themes } from "context/theme/types"
import { t } from "app/i18n/translate"

export const ThemeSettings = ({}: ThemeSettingsProps) => {
  const scrollRef = useRef<ScrollView>(null)
  const styles = useStyles()
  const { switchTheme, themeId } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState(themeId)
  const [contentWidth, setContentWidth] = useState(0)

  const scrollTo = useCallback((index: number) => {
    scrollRef?.current.scrollTo({
      x: contentWidth * index / 6
    })
  }, [scrollRef, contentWidth])

  useEffect(() => {
    if (themeId === Themes.Dark) {
      scrollTo(1)
    } else if (themeId === Themes.System) {
      scrollTo(2)
    }
  }, [scrollTo])

  return (
    <View style={ styles.root }>
      <Text style={ styles.header }>{ t("themeSettings") }</Text>
      <ScrollView
        onContentSizeChange={ setContentWidth }
        ref={ scrollRef }
        contentContainerStyle={ styles.container }
        horizontal
        showsHorizontalScrollIndicator={ false }>
        <ThemeItem
          onPress={ () => {
            setSelectedTheme(Themes.Light)
            switchTheme(Themes.Light)
            scrollTo(0)
          } }
          selected={ selectedTheme === Themes.Light }
          icon={ "theme_light" }
          title={ t("light") }
        />
        <ThemeItem
          onPress={ () => {
            setSelectedTheme(Themes.Dark)
            switchTheme(Themes.Dark)
            scrollTo(1)
          } }
          selected={ selectedTheme === Themes.Dark }
          icon={ "theme_dark" }
          title={ t("dark") }
        />
        <ThemeItem
          onPress={ () => {
            setSelectedTheme(Themes.System)
            switchTheme(Themes.System)
            scrollTo(2)
          } }
          selected={ selectedTheme === Themes.System }
          icon={ "theme_system" }
          title={ t("system") }
        />
      </ScrollView>
    </View>
  )
}
