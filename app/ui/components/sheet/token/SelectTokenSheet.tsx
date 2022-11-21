import { Props } from "./types"
import { useStyles } from "./styles"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePressBack } from "hooks/usePressBack"
import { Text, View } from "react-native"
import { t } from "app/i18n/translate"
import { Search } from "ui/components/search/Search"
import { NetworksCarousel } from "ui/components/carousel/NetworksCarousel"
import { Divider } from "ui/components/divider/Divider"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import NoTokenFound from "assets/images/noToken.svg"
import { verticalScale } from "utils/screenUtils"
import { TokenInfo } from "ui/components/token/TokenInfo"
import { mockAssets } from "ui/components/sheet/token/mocks"
import { Network } from "../../../../references/network"
import { AvailableNetworks } from "../../../../references/networks"
import { computed } from "mobx"
import { BigNumber } from "bignumber.js"
import { observer } from "mobx-react-lite"
import { isEmpty, toLowerCase } from "utils/common"
import { TokenWithBalance } from "../../../../references/tokens"

export const SelectTokenSheet = observer(({
                                            visible = false,
                                            onStateChange,
                                            onDismiss,
                                            forceAssets = mockAssets,
                                            forceNetworks = AvailableNetworks,
                                            onTokenPress,
                                          }: Props) => {
  const styles = useStyles()
  const { top: topInset } = useSafeAreaInsets()
  const [ selectedNetwork, setSelectedNetwork ] = useState(Network.ethereum) // by default
  const [ searchValue, setSearchValue ] = useState("")
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const snapPoints = useMemo(() => [ "CONTENT_HEIGHT", "100%" ], [])

  const handleTokenPress = useCallback((item: TokenWithBalance) => {
    onTokenPress?.(item)
    bottomSheetRef.current?.dismiss()
  }, [ bottomSheetRef, onTokenPress ])

  const tokensFilteredByChain = computed(() => {
    const tokens = forceAssets.filter(
      (token) => token.network === selectedNetwork,
    )

    if (!isEmpty(searchValue)) {
      const search = toLowerCase(searchValue)

      return tokens.filter(
        (token) =>
          toLowerCase(token.address).includes(search) ||
          toLowerCase(token.symbol).includes(search) ||
          toLowerCase(token.name).includes(search),
      )
    }

    return tokens.sort((a, b) =>
      new BigNumber(b.balance)
        .times(b.priceUSD)
        .minus(new BigNumber(a.balance).times(a.priceUSD))
        .toNumber(),
    )
  })

  const {
    animatedContentHeight,
    animatedHandleHeight,
    animatedSnapPoints,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints)

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

  const renderBackDrop = useCallback((backdropProps) => (
    <BottomSheetBackdrop
      { ...backdropProps }
      enableTouchThrough={ true }
      appearsOnIndex={ 0 }
      disappearsOnIndex={ -1 }
    />
  ), [])

  return (
    <BottomSheetModal
      topInset={ topInset }
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustPan"
      handleHeight={ animatedHandleHeight }
      contentHeight={ animatedContentHeight }
      backdropComponent={ renderBackDrop }
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
        onLayout={ handleContentLayout }
        style={ [
          styles.content,
        ] }>
        <Text style={ styles.title }>{ t("selectToken.title") }</Text>
        <Search
          onChangeText={ setSearchValue }
          containerStyle={ styles.search }
          hint={ t("selectToken.placeHolder") }
        />
        <NetworksCarousel
          header={ t("selectToken.network") }
          networks={ forceNetworks }
          onPress={ setSelectedNetwork }
          contentStyle={ styles.carousel }
        />
        <Divider
          style={ styles.divider }
        />
        { tokensFilteredByChain.get().length ? (
          <BottomSheetScrollView bounces={ false }>
            { tokensFilteredByChain.get().map((item, index) => (
              <TokenInfo
                key={ `${ item.address }_${ index }` }
                token={ item }
                onPress={ () => handleTokenPress(item) }
              />
            )) }
          </BottomSheetScrollView>
        ) : (
          <View style={ styles.empty }>
            <NoTokenFound
              width={ verticalScale(110) }
              height={ verticalScale(110) }
            />
            <Text style={ styles.emptyTitle }>{ t("selectToken.no-results") }</Text>
          </View>
        ) }
      </BottomSheetView>
    </BottomSheetModal>
  )
})
