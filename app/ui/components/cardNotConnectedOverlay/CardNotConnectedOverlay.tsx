import { observer } from "mobx-react-lite"
import { View } from "react-native"
import { useInstance } from "react-ioc"
import { CardSkinController } from "../../../controllers/CardSkinController"
import { useStyles } from "./styles"
import { PrimaryButton } from "ui/components/button/PrimaryButton"
import { Text } from "react-native-paper"
import { BlurView } from "@react-native-community/blur"
import { t } from "../../../i18n/translate"
import { WalletController } from "../../../controllers/WalletController"

export const CardNotConnectedOverlay = observer(() => {

  const styles = useStyles()
  const skinService = useInstance(CardSkinController)

  const walletService = useInstance(WalletController)

  return <View style={ styles.notConnected }>
    <BlurView
      style={ styles.absolute }
      blurType="light"
      blurAmount={ 9 }
      reducedTransparencyFallbackColor="white"
    />
    <PrimaryButton style={ styles.button } onPress={ () => walletService.setConnectProviderModal(true) }
                   title={ t("connectWallet") } />
    <Text style={ { ...styles.description, color: skinService?.skin?.textColor } }>{ t("connectWallet-title") }</Text>
  </View>
})
