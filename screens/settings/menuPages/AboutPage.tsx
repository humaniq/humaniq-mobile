import { Card, Colors, Text, View } from "react-native-ui-lib";
import { Header } from "../../../components/header/Header";
import { t } from "../../../i18n";
import React from "react";
import { Screen } from "../../../components";
import { useNavigation } from "@react-navigation/native";
import HumaniqLogo from "../../../assets/images/logo-brand-full.svg"
import { MenuItem } from "../../../components/menuItem/MenuItem";

const pack = require("../../../package.json")

export const AboutPage = () => {
  const nav = useNavigation()
  return <Screen style={ { height: "100%" } } preset={ "scroll" } backgroundColor={ Colors.bg }
                 statusBarBg={ Colors.bg }>
    <Header title={ t("settingsScreen.menu.aboutApplication") }/>
    <View flex paddingT-20 paddingH-16>
      <View row center>
        <HumaniqLogo width={ 100 } height={ 50 }/>
      </View>
      <View row center>
        <Text text12>
          v { pack.version }
        </Text>
      </View>
      <View paddingT-24>
        <Card>
          <MenuItem name={ t("settingsScreen.menu.privacyPolicyName") }
                    onPress={ () => nav.navigate("privacyPolicyPage") }/>
          <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 20 } }/>
          <MenuItem name={ t("settingsScreen.menu.termsOfServiceName") }
                    onPress={ () => nav.navigate("termsOfServicePage") }/>
        </Card>
      </View>
    </View>
  </Screen>
}

export const PrivacyPolicyPage = () => {
  return <Screen style={ { height: "100%" } } preset={ "scroll" } backgroundColor={ Colors.white }
                 statusBarBg={ Colors.bg }>
    <Header title={ t("settingsScreen.menu.privacyPolicyName") }/>
  </Screen>
}

export const TermsOfServicePage = () => {
  return <Screen style={ { height: "100%" } } preset={ "scroll" } backgroundColor={ Colors.white }
                 statusBarBg={ Colors.bg }>
    <Header title={ t("settingsScreen.menu.termsOfServiceName") }/>
  </Screen>
}