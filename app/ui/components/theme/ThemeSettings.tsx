import { ScrollView, View } from "react-native"
import { ThemeSettingsProps } from "./types"
import { useStyles } from "./styles"
import { ThemeItem } from "ui/components/theme/item/ThemeItem"
import { useCallback, useRef, useState } from "react"
import { useTheme } from "hooks/useTheme"
import { Themes } from "context/theme/types"

export const ThemeSettings = ({}: ThemeSettingsProps) => {
  const [selectedTheme, setSelectedTheme] = useState(Themes.Light)
  const scrollRef = useRef<ScrollView>(null)
  const styles = useStyles()
  const { switchTheme } = useTheme()

  const scrollTo = useCallback((width: number) => {
    scrollRef?.current.scrollTo({
      x: width
    })
  }, [scrollRef])

  return (
    <View style={ styles.root }>
      <ScrollView
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
          title={ "Light" }/>
        <ThemeItem
          onPress={ () => {
            setSelectedTheme(Themes.Dark)
            switchTheme(Themes.Dark)
            scrollTo(50)
          } }
          selected={ selectedTheme === Themes.Dark }
          icon={ "theme_dark" }
          title={ "Dark" }/>
        <ThemeItem
          onPress={ () => {
            setSelectedTheme(Themes.System)
            switchTheme(Themes.Dark)
            scrollTo(120)
          } }
          selected={ selectedTheme === Themes.System }
          icon={ "theme_system" }
          title={ "System" }/>
      </ScrollView>
    </View>
  )
}
