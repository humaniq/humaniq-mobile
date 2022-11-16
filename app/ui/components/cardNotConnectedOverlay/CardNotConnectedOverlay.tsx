import { observer } from "mobx-react-lite"
import { View } from "react-native"
import { useInstance } from "react-ioc"
import { CardSkinController } from "../../../controllers/CardSkinController"
import { useStyles } from "./styles"
import { Props } from "./types"
import { PrimaryButton } from "ui/components/button/PrimaryButton"
import { Text } from "react-native-paper"
import { BlurView } from "@react-native-community/blur"
import { t } from "../../../i18n/translate"
import { WalletController } from "../../../controllers/WalletController"

export const CardNotConnectedOverlay = observer(({ textColor }: Props) => {
  const styles = useStyles()
  const skinService = useInstance(CardSkinController)

  const walletService = useInstance(WalletController)

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
        color: textColor,
      } }>{ t("connectWallet-title") }</Text>
    </View>
  )
})
