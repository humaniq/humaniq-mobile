import React from "react"
import { CardScreenTypes } from "./types"
import { useStyles } from "./styles"
import { View } from "react-native"
import { MenuItem } from "ui/components/menu/MenuItem"
import { Search } from "ui/components/search/Search"
import { Header } from "ui/components/header/Header"
import { LockText } from "ui/components/lock/LockText"
import { CardInfoCard } from "ui/components/cardInfoCard/CardInfoCard"
import { Screen } from "ui/screens/screen/Screen"

export const CardScreen = ({}: CardScreenTypes) => {
  const styles = useStyles()


  return (
    <Screen style={ styles.root }>
      <Header title={ "Card" } back={ false } isSettings />
      <View style={ styles.content }>
        <CardInfoCard />
        <MenuItem
          icon={ "deposit" }
          title={ "Top up" }
          subTitle={ "Add cash to debit card" }
          arrowRight
        />
        <MenuItem
          icon={ "deposit" }
          title={ "Top down" }
          subTitle={ "Add cash to debit card" }
        />
        <MenuItem
          icon={ "card" }
          title={ "Top down" }
          subTitle={ "Add cash to debit card" }
          comingSoon
        />
      </View>
    </Screen>
  )
}
