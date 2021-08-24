import React, { useEffect } from "react";
import { provider, useInstance } from "react-ioc";
import { ActionSheet, Colors, ListItem, Switch, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { observer } from "mobx-react-lite";
import { Screen } from "../../components";
import { SettingsScreenModel } from "./SettingsScreenModel";
import * as Animatable from "react-native-animatable";
import { FlatList } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { t } from "../../i18n";
import { Header } from "../../components/header/Header";


const Settings = observer(function() {
  const view = useInstance(SettingsScreenModel);
  
  useEffect(() => {
    view.init();
  }, []);
  
  
  const keyExtractor = item => item.id;
  
  const renderRow = ({ item }) => {
    return (
      <Animatable.View animation={ "fadeIn" }>
        <TouchableOpacity
          accessible={ true }
          activeOpacity={ 0.5 }
          onPress={ item.type === "dialog" ? item.onPress : () => null }
        >
          <ListItem
            height={ 50 }
          >
            <ListItem.Part left paddingL-20>
              <Icon size={ 20 } name={ item.icon } />
            </ListItem.Part>
            <ListItem.Part middle column paddingL-20>
              <ListItem.Part>
                <Text dark10 text70 style={ { flex: 1, marginRight: 10 } } numberOfLines={ 1 }>{ item.name }</Text>
              </ListItem.Part>
            </ListItem.Part>
            <ListItem.Part left paddingL-20>
              <Icon size={ 20 } name={ item.icon } />

            </ListItem.Part>
            <ListItem.Part paddingH-20>
              { item.currentValue && item.type === "dialog" && <Text dark10>{ item.currentValue }</Text> }
              { item.type === "toggle" &&
              <Switch onValueChange={ item.onPress } value={ item.currentValue } /> }
            </ListItem.Part>
          </ListItem>
        </TouchableOpacity>
      </Animatable.View>
    );
  };
  
  return (
    <Screen preset={ "fixed" } backgroundColor={ Colors.dark70 } statusBarBg={ Colors.dark70 }>
      {
        view.initialized &&
        <Animatable.View animation={ "fadeIn" } style={ { height: "100%" } }>
          <Header title={ t("settingScreen.name") } />
          <View padding-20>
            <FlatList
              data={ view.settingsMenu() }
              renderItem={ renderRow }
              keyExtractor={ keyExtractor }
            />
          </View>
          <ActionSheet
            title={ view.settingsDialog.title }
            message={ "Message of action sheet" }
            options={ view.settingsDialog.options }
            visible={ view.settingsDialog.display }
            onDismiss={ () => view.settingsDialog.display = false }
          />
        </Animatable.View>
      }
    </Screen>
  );
});

export const SettingsScreen = provider()(Settings);
SettingsScreen.register(SettingsScreenModel);
