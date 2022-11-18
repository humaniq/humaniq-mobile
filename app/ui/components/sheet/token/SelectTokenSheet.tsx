import { Props } from "./types"
import { useStyles } from "./styles"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet"
import { useEffect, useMemo, useRef, useState } from "react"
import { usePressBack } from "hooks/usePressBack"
import { Text, View } from "react-native"
import { t } from "app/i18n/translate"
import { Search } from "ui/components/search/Search"
import { TokensCarousel } from "ui/components/carousel/TokensCarousel"
import { Divider } from "ui/components/divider/Divider"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { networks } from "../../../../references/networks"
import NoTokenFound from "assets/images/noToken.svg"

export const SelectTokenSheet = ({
                                   visible = false,
                                   onStateChange,
                                   onDismiss,
                                 }: Props) => {
  const styles = useStyles()
  const { top, bottom } = useSafeAreaInsets()
  const [ selectedNetwork, setSelectedNetwork ] = useState(networks.ethereum) // by default
  const [ data, setData ] = useState([])
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const snapPoints = useMemo(() => [ "CONTENT_HEIGHT", "100%" ], [])

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

  return (
    <BottomSheetModal
      topInset={ top }
      bottomInset={ bottom }
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
      handleIndicatorStyle={ styles.indicator }
      onDismiss={ onDismiss }
    >
      <BottomSheetView
        onLayout={ handleContentLayout }
        style={ styles.content }>
        <Text
          style={ styles.title }>{ t("selectToken.title") }</Text>
        <Search
          onChangeText={ text => {
          } }
          containerStyle={ styles.search }
          hint={ t("selectToken.placeHolder") }
        />
        <Text
          style={ styles.sub }>{ t("selectToken.network") }</Text>
        <TokensCarousel
          onPress={ setSelectedNetwork }
          contentStyle={ styles.carousel }
        />
        <Divider
          style={ styles.divider }
        />
        { data.length ? (
          <View></View>
        ) : (
          <View style={ styles.empty }>
            <NoTokenFound
              width={ 110 }
              height={ 110 }
            />
            <Text style={ styles.emptyTitle }>{ t("selectToken.no-results") }</Text>
          </View>
        ) }
      </BottomSheetView>
    </BottomSheetModal>
  )
}
