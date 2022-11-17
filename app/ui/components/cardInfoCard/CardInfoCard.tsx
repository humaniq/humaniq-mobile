import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View } from "react-native"
import { useStyles } from "./styles"
import { CardRender } from "ui/components/cardInfoCard/cardRender/CardRender"
import { useInstance } from "react-ioc"
import { CardSkinService } from "../../../services/microServices/cardSkin"
import { CardService, CardState } from "../../../services/microServices/cardService"
import { WalletService } from "../../../services/WalletService"

export const CardInfoCard = observer(() => {
  const styles = useStyles()
  const cardService = useInstance(CardService)
  const skinService = useInstance(CardSkinService)
  const walletService = useInstance(WalletService)

  useEffect(() => {
    ;(async () => {
      await skinService.init()
    })()
  }, [])
  // const wallet = useInstance( WalletService)

  // const newIncomingTransaction
  // const loadIncomingTransactionIntervalFunc = () => ()
  //
  // const holder = computed(() => showCardInfo?.holder)
  // const orderLocation = computed(() => ({ name: SCREENS.CARD_SCREEN }))
  // const showOrderAction = computed(() => false)
  // const showTagAction = computed(() => false)
  // const showIncomingTransactionAction = computed(() => false)
  // const showActionsContainer = computed(() => initialized && false)
  //
  // const incomingTransaction = computed(() => undefined)

  return (
    <View style={ styles.container }>
      <CardRender
        skin={ skinService.skin }
        expiration={ cardService.showCardInfo ? cardService.data.expiration : undefined }
        holder={ cardService.data.holder }
        iban={ cardService.showCardInfo ? cardService.data.iban : undefined }
        last4Digits={ cardService.data.last4Digits }
        initialized={ walletService.initialized }
        showMore={ [ CardState.Pending, CardState.OrderNow ].includes(cardService.data.cardState) }
      />
    </View>
  )
})