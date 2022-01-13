import { Screen } from "../screen/screen";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { t } from "../../i18n";
import React from "react";

export const CustomFallback = (props: { error: Error, resetError: () => void }) => (
    <Screen preset={ "fixed" } style={ { minHeight: "100%" } } backgroundColor={ Colors.bg } statusBarBg={ Colors.bg }>
      <View flex center>
        <Text text16 robotoM>{ t("errorBoundary.title") }</Text>
        <Text>{ props.error.toString() }</Text>
        <Button marginT-20 onPress={ props.resetError } label={ t("errorBoundary.tryAgain") }/>
      </View>
    </Screen>
)