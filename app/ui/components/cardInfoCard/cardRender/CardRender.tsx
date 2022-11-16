import React from "react"
import { ImageBackground, StyleProp, View, ViewStyle } from "react-native"
import dayjs from "dayjs"
import { useStyles } from "./styles"
import { Card, Text } from "react-native-paper"
import { computed } from "mobx"
import { Skin } from "../../../../services/microServices/cardSkin"
import { observer } from "mobx-react-lite"
import { TouchableIcon } from "ui/components/icon/TouchableIcon"
import { CardNotConnectedOverlay } from "ui/components/cardNotConnectedOverlay/CardNotConnectedOverlay"
import { noop } from "utils/common"
import { useTheme } from "hooks/useTheme"

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
  style?: StyleProp<ViewStyle>
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
    style,
  }: Props) => {
  const styles = useStyles()
  const { colors } = useTheme()

  const exp = computed(() => expiration ? expiration.format("MM/YY") : "")
  const textColor = computed(() => colors[skin?.textColor])
  const backGroundColor = computed(() => skin?.backgroundType === "color" ? colors[skin.backgroundColor] : "#fff")

  return (
    <Card style={ [ styles.root, { style } ] }>
      <View style={ styles.content }>
        <ImageBackground
          source={ skin?.backgroundType !== "color" ? skin?.picture?.src : undefined }
          resizeMode="cover"
          style={ [
            styles.background,
            skin?.backgroundType === "color" && {
              backgroundColor: backGroundColor.get(),
            } ] }
        />
        { showMore && (
          <TouchableIcon
            onPress={ onMorePressed }
            containerStyle={ styles.more }
            icon={ "dots" }
            color={ colors.secondary }
            size={ 26 }
          />
        ) }
        <View style={ styles.header }>
          <View style={ styles.headerRow }>
            <Text style={ { ...styles.textMedium, color: textColor.get() } }>••••</Text>
            <Text style={ { ...styles.textMedium, color: textColor.get() } }>••••</Text>
            <Text style={ { ...styles.textMedium, color: textColor.get() } }>••••</Text>
            <Text style={ { ...styles.textMedium, color: textColor.get() } }>{ last4Digits || "••••" }</Text>
          </View>
          { iban ? (
            <Text style={ { ...styles.textMedium, color: textColor.get() } }>{ iban }</Text>
          ) : null }
          { exp.get() ? (
            <Text style={ { ...styles.textMedium, color: textColor.get() } }>{ exp.get() }</Text>
          ) : null }
        </View>
        <View style={ styles.bottom }>
          <View style={ styles.expirationDots }>
            { holder ? (
              <Text style={ [ styles.textHolder, { color: textColor.get() } ] }>{ holder }</Text>
            ) : (
              <>
                <Text style={ { color: textColor.get(), ...styles.textHolder } }>••••</Text>
                <Text style={ { color: textColor.get(), ...styles.textHolder } }>••••</Text>
              </>
            ) }
          </View>
          { showVisa && (
            <TouchableIcon
              icon={ "visa" }
              color={ textColor.get() }
              size={ 22 }
            />
          ) }
        </View>
      </View>
      { !initialized && (
        <CardNotConnectedOverlay textColor={ textColor.get() }  />
      ) }
    </Card>
  )
})
