import React from "react"
import { ImageBackground, View } from "react-native"
import dayjs from "dayjs"
import { useStyles } from "./styles"
import { Card, Text } from "react-native-paper"
import { computed } from "mobx"
import { Skin } from "../../../../services/microServices/cardSkin"
import { observer } from "mobx-react-lite"
import { MovIcon } from "ui/components/icon/MovIcon"
import { useTheme } from "hooks/useTheme"

interface Props {
  expiration?: dayjs.Dayjs;
  last4Digits?: string;
  skin: Skin;
  iban?: string;
  holder?: string;
  children?: React.ReactElement
}

export const CardRender: React.FC<Props> = observer((
  {
    children,
    holder,
    iban,
    last4Digits,
    expiration,
    skin,
  }) => {

  const exp = computed(() => expiration ? expiration.format("MM/YY") : "")
  const styles = useStyles()
  const theme = useTheme()

  const textColor = computed(() => theme.colors[skin?.textColor])
  const backGroundColor = computed( () => skin?.backgroundType === "color" ? theme.colors[skin.backgroundColor] : "#fff")

  return <Card style={ { ...styles.card, backgroundColor: backGroundColor.get() } }>
    <ImageBackground
    resizeMode="cover"
    source={ { uri: skin?.backgroundType !== "color" ? skin?.picture?.src : undefined } }
    style={ skin?.backgroundType === "color" ? {
      backgroundColor: backGroundColor.get(),
      ...styles.backGroundImg
    } : styles.backGroundImg }>
      { children }
    <View style={ styles.cardNumber }>
      <Text style={ { color: textColor.get(), ...styles.textMedium } }>••••</Text>
      <Text style={ { color: textColor.get(), ...styles.textMedium } }>••••</Text>
      <Text style={ { color: textColor.get(), ...styles.textMedium } }>••••</Text>
      <Text style={ { color: textColor.get(), ...styles.textMedium } }>{ last4Digits || "••••" }</Text>
    </View>
    <View style={ styles.data }>
      { iban && <Text style={ { ...styles.textMedium, color: textColor.get() } }>{ iban }</Text> }
      { exp.get() && <Text style={ { ...styles.textMedium, color: textColor.get() } }>{ exp.get() }</Text> }
    </View>
    <View style={ styles.holder }>
      { holder ? <Text style={ { color: textColor.get() } }>{ holder }</Text> :
        <>
          <Text style={ { color: textColor.get(), ...styles.textHolder } }>••••</Text>
          <Text style={ { color: textColor.get(), ...styles.textHolder } }>••••</Text>
        </> }
    </View>
    <View style={ styles.logo }>
      <MovIcon
        name={ "visa" }
        size={ 25 }
        color={ { color: textColor.get() } } />
    </View>

  </ImageBackground></Card>
})
