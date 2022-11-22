import { CreateTagScreenProps } from "./types"
import { useStyles } from "./styles"
import React from "react"
import { Header } from "ui/components/header/Header"
import { PrimaryText } from "ui/components/text/PrimaryText"
import { PrimaryButton } from "ui/components/button/PrimaryButton"
import { t } from "app/i18n/translate"
import { Screen } from "ui/screens/screen/Screen"
import { MaskedInput } from "ui/components/input/MaskedInput"
import { TAG_MASK } from "ui/components/input/consts"
import { ScrollView } from "react-native"

export const CreateTagScreen = ({}: CreateTagScreenProps) => {
  const styles = useStyles()

  return (
    <Screen>
      <Header
        back={ false }
        title={ t("tag.getTheTagHeader") }
      />
      <ScrollView contentContainerStyle={ styles.content }>
        <MaskedInput
          containerStyle={ styles.input }
          title={ t("tag.chooseYourTag") }
          placeholder={ t("tag.tagChoosePlaceholder") }
          mask={ TAG_MASK }
        />
        <PrimaryText
          style={ styles.description }
          text={ t("tag.getDescription") }
        />
        <PrimaryButton
          disabled
          title={ t("tag.getTag") }
        />
      </ScrollView>
    </Screen>
  )
}
