import { RoundedIconProps } from "./types"
import { View } from "react-native"
import { useRoundIconStyles } from "./styles"
import { useTheme } from "hooks/useTheme"
import { verticalScale } from "utils/screenUtils"
import { MovIcon } from "ui/components/icon/MovIcon"

export const RoundedIcon = ({ icon }: RoundedIconProps) => {
  const styles = useRoundIconStyles()
  const theme = useTheme()

  return (
    <View style={ styles.root }>
      <MovIcon
        name={ icon }
        size={ verticalScale(27) }
        color={ theme.colors.primary }
      />
    </View>
  )
}
