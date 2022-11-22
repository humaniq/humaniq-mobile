import React from "react"
import { CardScreenTypes } from "./types"
import { useStyles } from "./styles"
import { ScrollView } from "react-native"
import { MenuItem } from "ui/components/menu/MenuItem"
import { Header } from "ui/components/header/Header"
import { CardInfoCard } from "ui/components/cardInfoCard/CardInfoCard"
import { Screen } from "ui/screens/screen/Screen"
import { observer } from "mobx-react-lite"
import { t } from "../../../i18n/translate"

export const CardScreen = observer(({}: CardScreenTypes) => {
  const styles = useStyles()

  return (
    <Screen style={ styles.root }>
      <Header
        title={ t("headerNavigation.card") }
        back={ false }
        isSettings
      />
      <ScrollView contentContainerStyle={ styles.content }>
        <CardInfoCard />
        <MenuItem
          icon={ "top_up" }
          title={ t("wallet.topUp.title") }
          subTitle={ t("wallet.topUp.subtitle") }
          arrowRight
        />
        <MenuItem
          icon={ "invite_friends" }
          title={ t("wallet.invite.title") }
          subTitle={ t("wallet.invite.subtitle") }
          comingSoon
          disabled
        />
      </ScrollView>
    </Screen>
  )
})
