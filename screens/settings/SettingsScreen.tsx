import React, { useEffect } from "react"
import { provider, useInstance } from "react-ioc"
import { Card, Colors, LoaderScreen, Text, View } from "react-native-ui-lib"
import { observer } from "mobx-react-lite"
import { Screen } from "../../components"
import { SettingsScreenModel } from "./SettingsScreenModel"
import { t } from "../../i18n"
import { Header } from "../../components/header/Header"
import { HIcon } from "../../components/icon";
import { MenuItem } from "../../components/menuItem/MenuItem";
import { getEthereumProvider } from "../../App";
import { useNavigation } from "@react-navigation/native";

const Settings = observer<{ route: any }>(function ({ route }) {
  const view = useInstance(SettingsScreenModel)
  const nav = useNavigation()

  useEffect(() => {
    nav.addListener('focus', async () => {
      view.init()
    })
  }, [])


  return (
      <Screen style={ { height: "100%" } } preset={ "scroll" } backgroundColor={ Colors.bg }
              statusBarBg={ Colors.bg }>
        {
          view.initialized &&
          <>
              <Header title={ t("settingsScreen.name") }/>

              <View flex paddingT-20 paddingH-16>
                  <Card padding-10 padding-0>
                      <MenuItem icon={ "key" }
                                name={ t("settingsScreen.menu.recoveryPhrase") }
                                value={ !view.recoveryRead &&
                                <View style={ { backgroundColor: Colors.rgba(Colors.error, 0.07) } }
                                      width={ 18 }
                                      height={ 18 }
                                      padding-4
                                      br100>
                                    <HIcon
                                        name="warning"
                                        size={ 9 }
                                        color={ Colors.error }/>
                                </View>
                                }
                                onPress={ () => nav.navigate("recoveryPhrase") }
                      />
                  </Card>
                  <Card padding-10 padding-0 marginT-16>
                      <MenuItem icon={ "network" }
                                name={ t("settingsScreen.menu.network") }
                                value={ <Text text16 textGrey> { getEthereumProvider().currentNetworkName } </Text> }
                                onPress={ () => nav.navigate("selectNetwork") }
                      />
                      <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 50 } }/>
                      <MenuItem icon={ "switch" }
                                name={ t("settingsScreen.menu.aboutApplication") }
                      />
                  </Card>
                  <Card padding-10 padding-0 marginT-16>
                      <MenuItem icon={ "logout" }
                                name={ t("settingsScreen.menu.signOut") }
                                showArrow={ false }
                      />
                  </Card>
              </View>
          </>
        }
        {

          !view.initialized && <View flex center><LoaderScreen/></View>
        }
      </Screen>
  )
})

export const SettingsScreen = provider()(Settings)
SettingsScreen.register(SettingsScreenModel)
