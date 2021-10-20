import React, { useEffect } from "react"
import { provider, useInstance } from "react-ioc"
import {
  ActionSheet,
  Button,
  Colors,
  ListItem,
  LoaderScreen,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native-ui-lib"
import { observer } from "mobx-react-lite"
import { Screen } from "../../components"
import { SettingsScreenModel } from "./SettingsScreenModel"
import * as Animatable from "react-native-animatable"
import FAIcon from "react-native-vector-icons/FontAwesome5"
import { t } from "../../i18n"
import { Header } from "../../components/header/Header"
import { ExportMnemonicDialog } from "../../components/dialogs/exportMnemonicDialog/ExportMnemonicDialog"
import { ExportMnemonicDialogViewModel } from "../../components/dialogs/exportMnemonicDialog/ExportMnemonicDialogViewModel"


const Settings = observer(function () {
  const view = useInstance(SettingsScreenModel)

  useEffect(() => {
    view.init()
  }, [])


  return (
      <Screen style={ { height: "100%" } } preset={ "scroll" } backgroundColor={ Colors.dark70 }
              statusBarBg={ Colors.dark70 }>
        {
          view.initialized &&
          <Animatable.View animation={ "fadeIn" } style={ { height: "100%" } }>
              <Header title={ t("settingsScreen.name") }/>
            { view.isAllInitialized ?
                <View row center paddingV-60>
                  <View flex-2/>
                  <View center>
                    <FAIcon color={ Colors.purple40 } size={ 190 } name={ "user-circle" }/>
                    <View style={ { position: "absolute", right: -15 } }>
                    </View>
                  </View>
                  <View flex-2/>
                </View> : <View row center paddingV-60 height={ 190 }><LoaderScreen/></View>
            }
              <View flex top bg-white>
                {
                  view.settingsMenu.map(item => {
                    console.log(item)
                    return <Animatable.View key={ item.id } animation={ "fadeIn" }>
                      <TouchableOpacity
                          accessible={ true }
                          activeOpacity={ 0.5 }
                      >
                        <ListItem
                            onPress={ (item.type === "actionSheet" || item.type === "dialog") ? item.onPress : () => null }
                            height={ 50 }
                        >
                          <ListItem.Part left paddingL-20>
                            <FAIcon color={ Colors.primary } size={ 20 } name={ item.icon }/>
                          </ListItem.Part>
                          <ListItem.Part middle column paddingL-20>
                            <ListItem.Part>
                              <Text dark10 text70 style={ { flex: 1, marginRight: 10 } }
                                    numberOfLines={ 1 }>{ item.name }</Text>
                            </ListItem.Part>
                          </ListItem.Part>
                          <ListItem.Part paddingH-20>
                            { item.currentValue && item.type === "actionSheet" &&
                            <Text dark10>{ item.currentValue }</Text> }
                            { item.type === "toggle" &&
                            <Switch onValueChange={ item.onPress }
                                    value={ item.currentValue }/> }
                          </ListItem.Part>
                        </ListItem>
                      </TouchableOpacity>
                    </Animatable.View>
                  })
                }
              </View>
              <ActionSheet
                  renderTitle={ () =>
                      <TouchableOpacity onPressIn={ () => view.settingsDialog.display = false }>
                        <View row paddingV-2 center>
                          <View flex center paddingH-20 paddingV-5>
                            <Button onPressIn={ () => view.settingsDialog.display = false }
                                    avoidInnerPadding avoidMinWidth
                                    style={ {
                                      padding: 4,
                                      paddingHorizontal: 20,
                                      backgroundColor: Colors.grey40
                                    } }/>
                          </View>
                        </View>
                      </TouchableOpacity>
                  }
                  dialogStyle={ { borderTopRightRadius: 30, borderTopLeftRadius: 30, paddingBottom: 10 } }
                  title={ view.settingsDialog.title }
                  message={ "Message of action sheet" }
                  options={ view.settingsDialog.options }
                  visible={ view.settingsDialog.display }
                  onDismiss={ () => view.settingsDialog.display = false }
              />
              <ExportMnemonicDialog/>
          </Animatable.View>
        }
        {

          !view.initialized && <View flex center><LoaderScreen/></View>
        }
      </Screen>
  )
})

export const SettingsScreen = provider()(Settings)
SettingsScreen.register(SettingsScreenModel, ExportMnemonicDialogViewModel)
