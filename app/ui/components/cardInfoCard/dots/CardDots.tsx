import { CardDotsProps } from "./types"
import { useStyles } from "./styles"
import { Text } from "react-native-paper"
import { View } from "react-native"
import React from "react"

export const CardDots = ({ skinColor, last4Digits, containerStyle }: CardDotsProps) => {
  const styles = useStyles()

  return (
    <View style={ [ styles.root, containerStyle ] }>
      <Text style={ { ...styles.textMedium, color: skinColor } }>••••</Text>
      <Text style={ { ...styles.textMedium, color: skinColor } }>••••</Text>
      <Text style={ { ...styles.textMedium, color: skinColor } }>••••</Text>
      <Text style={ { ...styles.textMedium, color: skinColor } }>{ last4Digits || "••••" }</Text>
    </View>
  )
}
