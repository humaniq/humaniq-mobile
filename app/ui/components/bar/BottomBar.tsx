import { BottomBarProps } from "./types"
import { useStyles } from "./styles"
import { useTheme } from "hooks/useTheme"
import { TouchableOpacity, View } from "react-native"
import { MovIcon } from "ui/components/icon"
import { useCallback } from "react"
import * as PATHS from "navigation/path"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const BottomBar = ({ state, navigation }: BottomBarProps) => {
  const styles = useStyles()
  const { colors } = useTheme()
  const { bottom } = useSafeAreaInsets()

  const onTabClick = useCallback((screen: string, params?: any) => {
    navigation.navigate(screen, params)
  }, [state.index])

  return (
    <View style={ [
      styles.root,
      bottom && { bottom }]
    }>
      <TouchableOpacity style={ styles.tab } onPress={ () => onTabClick(PATHS.CARD_SCREEN) }>
        <MovIcon
          name={ "card" }
          size={ 26 }
          color={ state.index === 0 ? colors.tabIconSelected : colors.tabIcon }/>
      </TouchableOpacity>

      <TouchableOpacity style={ styles.tab } onPress={ () => onTabClick(PATHS.EARN_SCREEN) }>
        <MovIcon
          name={ "dollar" }
          size={ 26 }
          color={ state.index === 1 ? colors.tabIconSelected : colors.tabIcon }/>
      </TouchableOpacity>

      <TouchableOpacity style={ styles.tab } onPress={ () => onTabClick(PATHS.HISTORY_SCREEN) }>
        <MovIcon
          name={ "history" }
          size={ 26 }
          color={ state.index === 2 ? colors.tabIconSelected : colors.tabIcon }/>
      </TouchableOpacity>
    </View>
  )
}
