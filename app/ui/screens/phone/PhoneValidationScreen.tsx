import { PhoneValidationScreenProps } from "./types"
import { useStyles } from "./styles"
import { Screen } from "ui/screens/screen/Screen"
import { Header } from "ui/components/header/Header"
import { t } from "app/i18n/translate"
import { PrimaryText } from "ui/components/text/PrimaryText"
import { ScrollView } from "react-native"
import { MaskedInput } from "ui/components/input/MaskedInput"
import { PHONE_CODE_MASK } from "ui/components/input/consts"
import { PrimaryButton } from "ui/components/button/PrimaryButton"
import React from "react"
import { LinkText } from "ui/components/text/LinkText"

export const PhoneValidationScreen = ({}: PhoneValidationScreenProps) => {
  const styles = useStyles()

  return (
    <Screen>
      <Header title={ t("phoneNumberValidation") }/>
      <ScrollView contentContainerStyle={ styles.content }>
        <PrimaryText
          style={ styles.title }
          text={ t("phoneNumberValidationDescriptionWithKnownPhone", {
            last4Digits: "4859"
          }) }
        />
        <MaskedInput
          title={ t("securityCode.label") }
          containerStyle={ styles.input }
          placeholder={ "• • • - • • •" }
          mask={ PHONE_CODE_MASK }
        />
        <PrimaryButton
          style={ styles.button }
          title={ t("fillOutContactDetails") }
          disabled={ true }
        />
        <LinkText
          text={ t("resendSecurityCodeAgain") }
        />
      </ScrollView>
    </Screen>
  )
}
