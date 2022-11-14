import { Text, TouchableOpacity, View } from "react-native"
import { useMemo, useRef } from "react"
import { Props } from "./types"
import { useStyles } from "./styles"
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { t } from "app/i18n/translate"
import { Switch } from "ui/components/switch/Switch"
import Metamask from "../../../assets/images/icons/metamask.svg"
import Coinbase from "../../../assets/images/icons/coinbase.svg"
import WalletConnect from "../../../assets/images/icons/wallet_connect.svg"
import { IconText } from "ui/components/text/IconText"
import { ParsedTextView } from "ui/components/parsed/ParsedTextView"
import { PROVIDERS } from "ui/components/sheet/consts"
import { useTheme } from "hooks/useTheme"

export const ConnectProviderSheet = ({
                                       visible,
                                       onProviderPressed,
                                       onTermsPressed,
                                       onStateChange,
                                       onDismiss
                                     }: Props) => {
  const styles = useStyles()
  const { colors } = useTheme()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const snapPoints = useMemo(() => ['50%', '75%', '100%'], [])

  if (!visible) return null

  return (
    <BottomSheet
      backdropComponent={ (backdropProps) => (
        <BottomSheetBackdrop
          { ...backdropProps }
          enableTouchThrough={ true }
        />
      ) }
      enablePanDownToClose={ true }
      ref={ bottomSheetRef }
      index={ 1 }
      snapPoints={ snapPoints }
      onChange={ onStateChange }
      backgroundStyle={ styles.root }
      handleIndicatorStyle={ styles.indicator }
      onClose={ onDismiss }
    >
      <View style={ styles.content }>
        <Text style={ styles.title }>{ t("web3Connect.title") }</Text>
        <View style={ styles.sub }>
          <ParsedTextView
            text={
              t("web3Connect.subtitle", {
                0: t("web3Connect.terms")
              })
            }
            style={ styles.subTitle }
            customPatterns={ [
              {
                pattern: new RegExp(t("web3Connect.terms")),
                style: styles.terms,
                onPress: onTermsPressed
              }
            ] }
          />
          <Switch color={ colors.greenLight }/>
        </View>

        <TouchableOpacity
          style={ styles.row }
          onPress={ () => onProviderPressed?.(PROVIDERS.METAMASK) }>
          <Text
            ellipsizeMode={ "tail" }
            numberOfLines={ 1 }
            style={ styles.rowTitle }>{ t("web3Connect.metamask") }</Text>
          <Metamask width={ 40 } height={ 40 }/>
        </TouchableOpacity>

        <TouchableOpacity
          style={ styles.row }
          onPress={ () => onProviderPressed?.(PROVIDERS.COINBASE) }>
          <Text
            ellipsizeMode={ "tail" }
            numberOfLines={ 1 }
            style={ styles.rowTitle }>{ t("web3Connect.coinbaseWallet") }</Text>
          <Coinbase width={ 40 } height={ 40 }/>
        </TouchableOpacity>

        <TouchableOpacity
          style={ styles.row }
          onPress={ () => onProviderPressed?.(PROVIDERS.WALLET_CONNECT) }>
          <Text
            ellipsizeMode={ "tail" }
            numberOfLines={ 1 }
            style={ styles.rowTitle }>{ t("web3Connect.walletConnect") }</Text>
          <WalletConnect width={ 40 } height={ 40 }/>
        </TouchableOpacity>

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
              count: 5193
            }) }
            icon={ "like" }
          />
        </View>
      </View>
    </BottomSheet>
  )
}
