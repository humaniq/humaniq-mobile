import { Text, View } from "react-native"
import { useEffect, useMemo, useRef, useState } from "react"
import { Props } from "./types"
import { useStyles } from "./styles"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet"
import { t } from "app/i18n/translate"
import { Switch } from "ui/components/switch/Switch"
import Metamask from "assets/images/icons/metamask.svg"
import WalletConnect from "assets/images/icons/wallet_connect.svg"
import { IconText } from "ui/components/text/IconText"
import { ParsedTextView } from "ui/components/parsed/ParsedTextView"
import { useTheme } from "hooks/useTheme"
import { usePressBack } from "hooks/usePressBack"
import { ProviderType } from "../../../../references/providers"
import { observer } from "mobx-react-lite"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ProviderItem } from "ui/components/sheet/provider/item/ProviderItem"

export const ConnectProviderSheet = observer(({
                                                visible = false,
                                                onProviderPressed,
                                                onTermsPressed,
                                                onStateChange,
                                                onDismiss,
                                              }: Props) => {
  const styles = useStyles()
  const { colors } = useTheme()
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const { top } = useSafeAreaInsets()
  const [ enabled, setEnabled ] = useState(false)

  const initialSnapPoints = useMemo(() => [ "CONTENT_HEIGHT", "100%" ], [])

  const {
    animatedContentHeight,
    animatedHandleHeight,
    animatedSnapPoints,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints)

  usePressBack(() => {
    bottomSheetRef.current?.dismiss()
  })

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present()
    } else {
      bottomSheetRef.current?.dismiss()
    }
  }, [ visible ])

  return (
    <BottomSheetModal
      topInset={ top }
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustPan"
      handleHeight={ animatedHandleHeight }
      contentHeight={ animatedContentHeight }
      backdropComponent={ (backdropProps) => (
        <BottomSheetBackdrop
          { ...backdropProps }
          enableTouchThrough={ true }
          appearsOnIndex={ 0 }
          disappearsOnIndex={ -1 }
        />
      ) }
      enablePanDownToClose={ true }
      ref={ bottomSheetRef }
      index={ 0 }
      snapPoints={ animatedSnapPoints }
      onChange={ onStateChange }
      backgroundStyle={ styles.root }
      handleIndicatorStyle={ styles.handle }
      onDismiss={ onDismiss }
    >
      <BottomSheetView
        style={ styles.content }
        onLayout={ handleContentLayout }>
        <Text style={ styles.title }>{ t("web3Connect.title") }</Text>
        <View style={ styles.sub }>
          <ParsedTextView
            text={
              t("web3Connect.subtitle", {
                0: t("web3Connect.terms"),
              })
            }
            style={ styles.subTitle }
            customPatterns={ [
              {
                pattern: new RegExp(t("web3Connect.terms")),
                style: styles.terms,
                onPress: onTermsPressed,
              },
            ] }
          />
          <Switch
            onToggle={ setEnabled }
            defaultState={ enabled }
            color={ colors.greenLight }
          />
        </View>
        <ProviderItem
          disabled={ !enabled }
          title={ t("web3Connect.metamask") }
          icon={
            <Metamask width={ 40 } height={ 40 } />
          }
          onPress={ () => onProviderPressed?.(ProviderType.Metamask) }
        />
        <ProviderItem
          disabled={ !enabled }
          title={ t("web3Connect.walletConnect") }
          icon={
            <WalletConnect width={ 40 } height={ 40 } />
          }
          onPress={ () => onProviderPressed?.(ProviderType.WalletConnect) }
        />
        <View style={ styles.footer }>
          <IconText
            text={ t("web3Connect.permissionDescription") }
            icon={ "eye" }
          />
          <IconText
            style={ styles.footerRow }
            text={ t("web3Connect.openSource") }
            icon={ "lock" }
          />
          <IconText
            style={ styles.footerRow }
            text={ t("web3Connect.trustedBy", {
              count: 5193,
            }) }
            icon={ "like" }
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
})
