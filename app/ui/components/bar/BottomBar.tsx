import { BottomBarProps } from "./types"
import { useStyles } from "./styles"
import { useTheme } from "hooks/useTheme"
import { TouchableOpacity, View } from "react-native"
import { useCallback } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MovIcon } from "ui/components/icon/MovIcon"

export const BottomBar = ({
                            state,
                            navigation
                          }: BottomBarProps) => {
  const styles = useStyles()
  const { colors } = useTheme()
  const { bottom } = useSafeAreaInsets()

  const onTabClick = useCallback((screen: string, params?: any) => {
    navigation.navigate(screen, params)
  }, [state.index])

  const getIcon = useCallback((route: string) => {
    if (route === 'Card') {
      return "card"
    } else if (route === 'Earn') {
      return "dollar"
    } else {
      return "history"
    }
  }, [state.routeNames])

  return (
    <View style={ [
      styles.root,
      bottom && { bottom }]
    }>
      { state.routes.map((item, index) => {
        return (
          <TouchableOpacity key={ item.name } style={ styles.tab } onPress={ () => onTabClick(item.name) }>
            <MovIcon
              name={ getIcon(item.name) }
              size={ 26 }
              color={ state.index === index ? colors.primary : colors.tabIcon }/>
          </TouchableOpacity>
        )
      }) }
    </View>
  )
}
