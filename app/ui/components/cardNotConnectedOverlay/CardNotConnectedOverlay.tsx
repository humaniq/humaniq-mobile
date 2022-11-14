import { observer } from "mobx-react-lite"
import { View } from "react-native"
import { useInstance } from "react-ioc"
import { CardSkinService } from "../../../services/microServices/cardSkin"
import { useStyles } from "./styles"
import { PrimaryButton } from "ui/components/button/PrimaryButton"
import { Text } from "react-native-paper"
import { BlurView } from "@react-native-community/blur"

export const CardNotConnectedOverlay = observer(() => {

  const styles = useStyles()
  const skinService = useInstance(CardSkinService)
  return <View style={ styles.notConnected }>
    <BlurView
      style={ styles.absolute }
      blurType="light"
      blurAmount={ 5 }
      reducedTransparencyFallbackColor="white"
    />
    <PrimaryButton onPress={ () => ({}) } title={ "Connect" } />
    <Text style={ { ...styles.description, color: skinService?.skin?.textColor } }>connectWallet-title"</Text>
  </View>
})
