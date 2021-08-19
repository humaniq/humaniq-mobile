import { Button, Colors, Dialog, ListItem, LoaderScreen, Text, View } from "react-native-ui-lib";
import { runInAction } from "mobx";
import React from "react";
import { useInstance } from "react-ioc";
import { WalletsScreenModel } from "../WalletsScreenModel";
import { observer } from "mobx-react-lite";
import { t } from "../../../i18n";
import FAIcon from "react-native-vector-icons/FontAwesome5";
import Ripple from "react-native-material-ripple";

export const WalletsMenuDialog = observer(() => {
  const view = useInstance(WalletsScreenModel);
  return <Dialog
    width={ "100%" }
    containerStyle={ { backgroundColor: Colors.grey80 } }
    onDismiss={ () => runInAction(() => view.walletDialogs.menu.display = false) }
    visible={ view.walletDialogs.menu.display }
    bottom
  >
    <View>
      <View row paddingV-10 center>
        <View flex right paddingH-20 paddingV-5>
          <Button onPress={ () => view.walletDialogs.menu.display = false } link
                  label={ t("common.cancel") } />
        </View>
      </View>
      { !view.walletDialogs.pending &&
      <View marginB-20>
        { view.walletDialogs.menu.items.map(i => {
          return <Ripple
            key={ i.name }
            rippleColor={ Colors.primary }
            onPress={ i.action }
          >
            <ListItem row>
              <View padding-20 row center>
                <FAIcon size={ 20 } color={ Colors.primary } name={ i.icon } />
                <Text marginL-20 text60R dark20>{ i.name }</Text>
              </View>
            </ListItem>
          </Ripple>;
        }) }
      </View>
      }
      {
        view.walletDialogs.pending &&
        <View marginH-30 marginV-10 height={ 200 }><LoaderScreen color={ Colors.grey20 } /></View>
      }
    </View>
  </Dialog>;
});
