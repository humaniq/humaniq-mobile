import { SettingsScreenProps } from "./types"
import { useStyles } from "./styles"
import React, { useState } from "react"
import { Header } from "ui/components/header/Header"
import { ThemeSettings } from "ui/components/theme/ThemeSettings"
import { Select } from "ui/components/select/Select"
import { PrimaryButton } from "ui/components/button/PrimaryButton"
import { Avatar } from "ui/components/avatar/Avatar"
import { ScrollView, Text } from "react-native"
import { useTheme } from "hooks/useTheme"
import { Currencies, Languages } from "./data"
import { t } from "app/i18n/translate"
import { Screen } from "ui/screens/screen/Screen"
import { SelectTokenSheet } from "ui/components/sheet/token/SelectTokenSheet"

export const SettingsScreen = ({}: SettingsScreenProps) => {
  const styles = useStyles()
  const { switchAppLang, appLang } = useTheme()
  const [visible, setVisible] = useState(false)

  return (
    <>
      <Screen style={ styles.root }>
        <Header
          back={ false }
          title={ t("settings") }
        />
        <ScrollView>
          <Avatar containerStyle={ styles.avatar }/>
          <Text style={ styles.tag }>{ t("tag.yourTag") }</Text>
          <Text style={ styles.tag2 }>{ t("tag.notSet") }</Text>
          <ThemeSettings/>
          <Select
            selectedValue={ Currencies.find((item) => item.value === "usd") }
            containerStyle={ styles.currency }
            data={ Currencies }
            header={ t("baseCurrency") }
            description={ t("baseCurrencyDescription") }
          />
          <Select
            selectedValue={ Languages.find((item) => item.value === appLang) }
            onItemClick={ (item) => {
              switchAppLang(item.value)
            } }
            data={ Languages }
            containerStyle={ styles.language }
            header={ t("language") }
          />
          <PrimaryButton
            style={ styles.button }
            title={ t("disconnectWalletWithAddress", {
              address: "0xf6A0…050b7"
            }) }
            onPress={ () => {
              setVisible(true)
            } }
          />
        </ScrollView>
      </Screen>
      <SelectTokenSheet
        visible={ visible }
        onDismiss={ () => setVisible(false) }
      />
    </>
  )
}
