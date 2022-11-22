import { PersonalInfoScreenProps } from "./types"
import { useStyles } from "./styles"
import { Screen } from "ui/screens/screen/Screen"
import { Header } from "ui/components/header/Header"
import { t } from "app/i18n/translate"
import { PrimaryText } from "ui/components/text/PrimaryText"
import { Select } from "ui/components/select/Select"
import { GENDER } from "./consts"
import { Input } from "ui/components/input/Input"
import { ScrollView } from "react-native"
import { PrimaryButton } from "ui/components/button/PrimaryButton"
import React from "react"
import { IconText } from "ui/components/text/IconText"
import { MaskedInput } from "ui/components/input/MaskedInput"
import { DATE_MASK } from "ui/components/input/consts"
import { Card } from "ui/components/card/Card"

export const PersonalInfoScreen = ({}: PersonalInfoScreenProps) => {
  const styles = useStyles()

  return (
    <Screen>
      <Header
        back={ true }
        title={ t("personalInfo") }
      />
      <ScrollView
        contentContainerStyle={ styles.content }
        showsVerticalScrollIndicator={ false }>
        <PrimaryText
          text={ t("dataProcessingReminder") }
          style={ styles.title }
        />
        <Card skin={ require("../../../assets/images/card_skin_cat.png") }/>
        <Select
          header={ t("gender.label") }
          data={ GENDER }
          placeholder={ t("gender.placeholder") }
          containerStyle={ styles.gender }
        />
        <Input
          title={ t("firstName.label") }
          placeholder={ t("firstName.placeholder") }
        />
        <Input
          title={ t("lastName.label") }
          placeholder={ t("lastName.placeholder") }
          containerStyle={ styles.input }
        />
        <MaskedInput
          title={ t("dateOfBirth.label") }
          containerStyle={ styles.input }
          placeholder={ "04.02.1969" }
          mask={ DATE_MASK }
        />
        <PrimaryButton
          style={ styles.button }
          title={ t("fillOutPersonalInfo") }
          disabled={ true }
        />
        <IconText
          icon={ "lock" }
          text={ t("dataStorageReminder") }
        />
      </ScrollView>
    </Screen>
  )
}
