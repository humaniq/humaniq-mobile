import { observer } from "mobx-react-lite"
import { View } from "react-native"
import { useInstance } from "react-ioc"
import { CardSkinService } from "../../../services/microServices/cardSkin"
import { useStyles } from "./styles"
import { PrimaryButton } from "ui/components/button/PrimaryButton"
import { Text } from "react-native-paper"
import { BlurView } from "@react-native-community/blur"
import { t } from "../../../i18n/translate"

export const CardNotConnectedOverlay = observer(() => {

  const styles = useStyles()
  const skinService = useInstance(CardSkinService)
  return <View style={ styles.notConnected }>
    <BlurView
      style={ styles.absolute }
      blurType="light"
      blurAmount={ 9 }
      reducedTransparencyFallbackColor="white"
    />
    <PrimaryButton style={ styles.button } onPress={ () => ({}) } title={ t("connectWallet") } />
    <Text style={ { ...styles.description, color: skinService?.skin?.textColor } }>{ t("connectWallet-title") }</Text>
  </View>
})
