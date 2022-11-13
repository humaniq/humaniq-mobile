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

export const PersonalInfoScreen = ({}: PersonalInfoScreenProps) => {
  const styles = useStyles()

  return (
    <Screen>
      <Header
        back={true}
        title={ t("personalInfo") }
      />
      <ScrollView>
        <PrimaryText
          text={ t("dataProcessingReminder") }
          style={ styles.title }
        />
        <Select
          header={ t("gender.label") }
          data={ GENDER }
          placeholder={ t("gender.placeholder") }
          containerStyle={ styles.gender }
        />
        <Input
          title={ t("firstName.label") }
          placeholder={ t("firstName.placeholder") }
          containerStyle={ styles.input }
        />
        <Input
          title={ t("lastName.label") }
          placeholder={ t("lastName.placeholder") }
          containerStyle={ styles.input }
        />
        <Input
          title={ t("dateOfBirth.label") }
          containerStyle={ styles.input }
          placeholder={ "04.02.1969" }
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
