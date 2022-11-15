import { TokenItemProps } from "./types"
import { useStyles } from "./styles"
import { Text, TouchableOpacity } from "react-native"
import EthereumIcon from "assets/images/icons/networks/icon-ethereum.svg"
import { useTheme } from "hooks/useTheme"

export const TokenItem = ({ selected, style, onPress }: TokenItemProps) => {
  const styles = useStyles()
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      onPress={ onPress }
      style={ [styles.root, selected && styles.selected] }>
      <EthereumIcon style={ styles.icon }/>
      <Text
        ellipsizeMode={ "tail" }
        numberOfLines={ 1 }
        style={ styles.text }>Ethereum</Text>
    </TouchableOpacity>
  )
}
