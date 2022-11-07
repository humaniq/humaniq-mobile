import { RoundedIconProps } from "./types"
import { View } from "react-native"
import { useStyles } from "./styles"
import { MovIcon } from "ui/components/icon"
import { useTheme } from "hooks/useTheme"
import { verticalScale } from "utils/screenUtils"

export const RoundedIcon = ({ icon }: RoundedIconProps) => {
  const styles = useStyles()
  const theme = useTheme()

  return (
    <View style={ styles.root }>
      <MovIcon name={ icon } size={ verticalScale(26) } color={ theme.colors.roundedIcon }/>
    </View>
  )
}
