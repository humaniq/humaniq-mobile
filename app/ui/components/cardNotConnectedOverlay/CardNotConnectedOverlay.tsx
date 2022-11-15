import { observer } from "mobx-react-lite"
import { View } from "react-native"
import { useInstance } from "react-ioc"
import { CardSkinService } from "../../../services/microServices/cardSkin"
import { useStyles } from "./styles"
import { PrimaryButton } from "ui/components/button/PrimaryButton"
import { Text } from "react-native-paper"
import { BlurView } from "@react-native-community/blur"
import { t } from "../../../i18n/translate"
import { WalletService } from "../../../services/WalletService"

export const CardNotConnectedOverlay = observer(() => {
  const styles = useStyles()

  const skinService = useInstance(CardSkinService)
  const walletService = useInstance(WalletService)

  return (
    <View style={ styles.root }>
      <BlurView
        style={ styles.blur }
        blurType="light"
        blurAmount={ 7 }
        reducedTransparencyFallbackColor="white"
      />
      <PrimaryButton
        onPress={ () => walletService.setConnectProviderModal(true) }
        title={ t("connectWallet") }
      />
      <Text style={ {
        ...styles.description,
        // color: skinService?.skin?.textColor,
      } }>{ t("connectWallet-title") }</Text>
    </View>
  )
})
