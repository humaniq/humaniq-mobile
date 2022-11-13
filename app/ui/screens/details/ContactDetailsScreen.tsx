import { ContactDetailsScreenProps } from "./types"
import { useStyles } from "./styles"
import React from "react"
import { Header } from "ui/components/header/Header"
import { Text } from "react-native-paper"
import { PrimaryButton } from "ui/components/button/PrimaryButton"
import { Input } from "ui/components/input/Input"
import { IconText } from "ui/components/text/IconText"
import { t } from "app/i18n/translate"
import { MaskedInput } from "ui/components/input/MaskedInput"
import { PHONE_MASK } from "ui/components/input/consts"
import { Screen } from "ui/screens/screen/Screen"

export const ContactDetailsScreen = ({}: ContactDetailsScreenProps) => {
  const styles = useStyles()

  return (
    <Screen>
      <Header title={ t("contactDetails") }/>
      <Text style={ styles.title }>{ t("dataProcessingReminder") }</Text>
      <Input
        containerStyle={ styles.input }
        placeholder={ t("email.label") }
        title={ t("email.label") }
      />
      <MaskedInput
        containerStyle={ styles.input }
        title={ t("phone.label") }
        placeholder={ "+37" }
        mask={ PHONE_MASK }
      />
      <PrimaryButton
        style={ styles.button }
        title={ t("fillOutContactDetails") }
        disabled={ true }
      />
      <IconText
        icon={ "lock" }
        text={ t("dataStorageReminder") }
      />
    </Screen>
  )
}
