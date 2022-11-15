import React from "react"
import { ImageBackground, View } from "react-native"
import dayjs from "dayjs"
import { useStyles } from "./styles"
import { Card, Text } from "react-native-paper"
import { computed } from "mobx"
import { Skin } from "../../../../services/microServices/cardSkin"
import { observer } from "mobx-react-lite"
import { MovIcon } from "ui/components/icon/MovIcon"

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

  return <Card style={ styles.card }>
    <ImageBackground
    resizeMode="cover"
    source={ { uri: skin?.backgroundType !== "color" ? skin?.picture?.src : undefined } }
    style={ skin?.backgroundType === "color" ? {
      backgroundColor: skin?.backgroundColor,
      ...styles.backGroundImg
    } : styles.backGroundImg }>
      { children }
    <View style={ styles.cardNumber }>
      <Text style={ { color: skin?.textColor, ...styles.textMedium } }>••••</Text>
      <Text style={ { color: skin?.textColor, ...styles.textMedium } }>••••</Text>
      <Text style={ { color: skin?.textColor, ...styles.textMedium } }>••••</Text>
      <Text style={ { color: skin?.textColor, ...styles.textMedium } }>{ last4Digits || "••••" }</Text>
    </View>
    <View style={ styles.data }>
      { iban && <Text style={ { ...styles.textMedium, color: skin?.textColor } }>{ iban }</Text> }
      { exp.get() && <Text style={ { ...styles.textMedium, color: skin?.textColor } }>{ exp.get() }</Text> }
    </View>
    <View style={ styles.holder }>
      { holder ? <Text style={ { color: skin?.textColor } }>{ holder }</Text> :
        <>
          <Text style={ { color: skin?.textColor, ...styles.textHolder } }>••••</Text>
          <Text style={ { color: skin?.textColor, ...styles.textHolder } }>••••</Text>
        </> }
    </View>
    <View style={ styles.logo }>
      <MovIcon
        name={ "visa" }
        size={ 25 }
        color={ { color: skin?.textColor } } />
    </View>

  </ImageBackground></Card>
})
