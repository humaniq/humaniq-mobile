import { Props } from "./types"
import { useStyles } from "./styles"
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet"
import { useTheme } from "hooks/useTheme"
import { useEffect, useMemo, useRef } from "react"
import { usePressBack } from "hooks/usePressBack"
import { Text, View } from "react-native"
import { t } from "app/i18n/translate"
import { Search } from "ui/components/search/Search"
import { TokensCarousel } from "ui/components/carousel/TokensCarousel"
import { Divider } from "ui/components/divider/Divider"

const networks = []

export const SelectTokenSheet = ({
                                   visible = false,
                                   onStateChange,
                                   onDismiss,
                                 }: Props) => {
  const styles = useStyles()
  const { colors } = useTheme()
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const snapPoints = useMemo(() => [ "55%", "100%" ], [])

  usePressBack(() => {
    bottomSheetRef.current?.close()
  })

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present()
    } else {
      bottomSheetRef.current?.close()
    }
  }, [ visible ])

  return (
    <BottomSheetModal
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
      snapPoints={ snapPoints }
      onChange={ onStateChange }
      backgroundStyle={ styles.root }
      handleIndicatorStyle={ styles.indicator }
      onDismiss={ onDismiss }
    >
      <View style={ styles.content }>
        <Text
          style={ styles.title }>{ t("selectToken.title") }</Text>
        <Search
          containerStyle={ styles.search }
          hint={ t("selectToken.placeHolder") }
        />
        <Text
          style={ styles.sub }>{ t("selectToken.network") }</Text>
        <TokensCarousel
          contentStyle={ styles.carousel }
        />
        <Divider
          style={ styles.divider }
        />
      </View>
    </BottomSheetModal>
  )
}
