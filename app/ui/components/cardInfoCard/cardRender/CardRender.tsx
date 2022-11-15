import React from "react"
import { ImageBackground, View } from "react-native"
import dayjs from "dayjs"
import { useStyles } from "./styles"
import { Card, Text } from "react-native-paper"
import { computed } from "mobx"
import { Skin } from "../../../../services/microServices/cardSkin"
import { observer } from "mobx-react-lite"
import { MIcon } from "ui/components/icon/MIcon"
import { CardDots } from "ui/components/cardInfoCard/dots/CardDots"
import { CardNotConnectedOverlay } from "ui/components/cardNotConnectedOverlay/CardNotConnectedOverlay"
import { noop } from "utils/common"

interface Props {
  expiration?: dayjs.Dayjs
  last4Digits?: string
  skin: Skin
  iban?: string
  holder?: string
  showVisa?: boolean
  initialized?: boolean
  showMore?: boolean
  onMorePressed?: typeof noop
}

export const CardRender = observer((
  {
    holder,
    iban,
    last4Digits,
    expiration,
    skin,
    showVisa = true,
    initialized = false,
    showMore = false,
    onMorePressed,
  }: Props) => {
  const styles = useStyles()
  const exp = computed(() => expiration ? expiration.format("MM/YY") : "")

  return (
    <Card style={ styles.root }>
      <View style={ styles.content }>
        <ImageBackground
          resizeMode="cover"
          style={ styles.background }
        />
        { showMore && (
          <MIcon
            onPress={ onMorePressed }
            containerStyle={ styles.more }
            icon={ "dots" }
            color={ "#B1B1B1" }
            size={ 26 }
          />
        ) }
        <CardDots
          containerStyle={ styles.header }
          last4Digits={ last4Digits }
          skinColor={ skin?.textColor }
        />
        {/*<View>*/ }
        {/*  { iban ? (*/ }
        {/*    <Text style={ { ...styles.textMedium, color: skin?.textColor } }>{ iban }</Text>*/ }
        {/*  ) : null }*/ }
        {/*  { exp.get() ? (*/ }
        {/*    <Text style={ { ...styles.textMedium, color: skin?.textColor } }>{ exp.get() }</Text>*/ }
        {/*  ) : null }*/ }
        {/*</View>*/ }
        <View style={ styles.bottom }>
          <View style={ styles.expirationDots }>
            { holder ? (
              <Text style={ [ styles.textHolder, { color: skin?.textColor } ] }>{ holder }</Text>
            ) : (
              <>
                <Text style={ { color: skin?.textColor, ...styles.textHolder } }>••••</Text>
                <Text style={ { color: skin?.textColor, ...styles.textHolder } }>••••</Text>
              </>
            ) }
          </View>
          { showVisa && (
            <MIcon
              icon={ "visa" }
              color={ skin?.textColor }
              size={ 22 }
            />
          ) }
        </View>
      </View>
      { !initialized && (
        <CardNotConnectedOverlay />
      ) }
    </Card>
  )
})
