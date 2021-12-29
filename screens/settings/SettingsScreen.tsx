import React, { useEffect } from "react"
import { provider, useInstance } from "react-ioc"
import { Button, Card, Colors, Dialog, LoaderScreen, Switch, Text, View } from "react-native-ui-lib"
import { observer } from "mobx-react-lite"
import { Screen } from "../../components"
import { SettingsScreenModel } from "./SettingsScreenModel"
import { t } from "../../i18n"
import { Header } from "../../components/header/Header"
import { HIcon } from "../../components/icon";
import { MenuItem } from "../../components/menuItem/MenuItem";
import { getAppStore, getEthereumProvider } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { runUnprotected } from "mobx-keystone";
import { localStorage } from "../../utils/localStorage";

const Settings = observer<{ route: any }>(function ({ route }) {
  const view = useInstance(SettingsScreenModel)
  const nav = useNavigation()

  useEffect(() => {
    nav.addListener('focus', async () => {
      view.init()
    })
  }, [])


  return (
      <>
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
                                    value={ <Text text16
                                                  textGrey> { getEthereumProvider().currentNetworkName } </Text> }
                                    onPress={ () => nav.navigate("selectNetwork") }
                          />
                          <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 50 } }/>
                          <MenuItem icon={ "switch" }
                                    name={ t("settingsScreen.menu.aboutApplication") }
                                    onPress={ () => nav.navigate("aboutPage") }
                          />
                      </Card>
                      <Card padding-10 padding-0 marginT-16>
                          <MenuItem icon={ "logout" }
                                    name={ t("settingsScreen.menu.signOut") }
                                    showArrow={ false }
                                    onPress={ () => view.exitDialogVisible = !view.exitDialogVisible }
                          />
                        { __DEV__ && <>
                            <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 50 } }/>
                            <View row padding-16 spread>
                                <Text>Отключить пин код?</Text>
                                <Switch onValueChange={ (val?: boolean) => {
                                  console.log(getAppStore().storedPin)
                                  runUnprotected(() => {
                                    getAppStore().storedPin = val ? getAppStore().savedPin : false
                                  })
                                  localStorage.save("hm-wallet-settings", getAppStore().storedPin)
                                } }
                                        value={ !!getAppStore().storedPin }/>
                            </View>
                        </> }
                      </Card>
                  </View>
              </>
          }
          {

              !view.initialized && <View flex center><LoaderScreen/></View>
          }
        </Screen>
        <Dialog center visible={ view.exitDialogVisible }
                containerStyle={ { backgroundColor: Colors.white, padding: 24 } }
                ignoreBackgroundPress
        >
          <Text text16>{ t("exitDialog.title") }</Text>
          <Text marginV-20>{ t("exitDialog.description") }</Text>
          <View row right>
            <Button link label={ t("common.signOut") }
                    onPress={ () => {
                      getAppStore().logout()
                    } }
            />
            <Button marginL-20 link label={ t("common.cancel") } onPress={ () => view.exitDialogVisible = false }/>
          </View>
        </Dialog>
      </>
  )
})

export const SettingsScreen = provider()(Settings)
SettingsScreen.register(SettingsScreenModel)
