import React, { useEffect } from "react";
import { provider, useInstance } from "react-ioc";
import { Button, Card, Colors, LoaderScreen, Text, View } from "react-native-ui-lib";
import { observer } from "mobx-react-lite";
import { Screen } from "../../components";
import { WalletScreenModel } from "./WalletScreenModel";
import Icon from "react-native-vector-icons/Ionicons";
import { runInAction } from "mobx";
import FAIcon from "react-native-vector-icons/FontAwesome5";
import { CreateWalletDialog } from "./dialogs/CreateWalletDialog";
import { SaveWalletDialog } from "./dialogs/SaveWalletDialog";
import { RemoveWalletDialog } from "./dialogs/RemoveWalletDialog";
import { useNavigation } from "@react-navigation/native";
import { RootStore } from "../../store/RootStore";

const Wallet = observer(function() {
  const view = useInstance(WalletScreenModel);
  const store = useInstance(RootStore);
  const nav = useNavigation();
  
  
  useEffect(() => {
    view.init(store);
  }, []);
  return (
    <View testID="WelcomeScreen" flex style={ { height: "100%" } }>
      { view.initialized &&
      <Screen style={ { height: "100%" } } statusBar={ "light-content" } preset="scroll"
              backgroundColor={ Colors.dark80 }>
        <Text h5 bold marginV-20 center grey20>Кошельки</Text>
        <View animated row padding-20 spread>
          <View left right>
            <Button labelStyle={ { marginLeft: 10 } } backgroundColor={ Colors.grey10 } label={ "WalletConnect" }>
              <Icon size={ 20 } name="wifi" color={ Colors.grey80 } />
            </Button>
          </View>
          <View right flex>
            <Button onPress={ view.createWalletInit } round backgroundColor={ Colors.grey10 }>
              <Icon size={ 20 } name="add" color={ Colors.grey80 } />
            </Button>
          </View>
        </View>
        <View>
          { store.walletStore.wallets.map(w => {
            return <Card height={ 100 } margin-10 padding-20 animated key={ w.address }
                         onPress={ () => nav.navigate("mainStack", {
                           screen: "wallet",
                           params: {
                             screen: "wallet-eth",
                             params: {
                               wallet: w.address
                             }
                           }
                         }) }>
              <View row flex>
                <View flex-8>
                  <View row flex>
                    <View>
                      <Text dark40 bold>ETH</Text>
                    </View>
                    <View paddingL-10>
                      <Text dark40>{ w.formatAddress }</Text>
                    </View>
                  </View>
                  <View row flex left>
                    { !w.pending && <Text dark20 h4 bold>{ w.formatBalance }</Text> }
                    { w.pending && <LoaderScreen /> }
                  </View>
                </View>
                <View flex-1 center right>
                  <Button
                    onPress={ () => runInAction(() => {
                      view.walletDialogs.menu.display = !view.walletDialogs.menu.display;
                      view.walletDialogs.menu.currentWallet = w.address;
                    }) }
                    round backgroundColor={ Colors.grey60 }>
                    <FAIcon name={ "ellipsis-v" } />
                  </Button>
                </View>
              </View>
            </Card>;
          }) }
        </View>
      </Screen> }
      <CreateWalletDialog />
      <SaveWalletDialog />
      <RemoveWalletDialog />
    </View>
  );
});

export const WalletScreen = provider()(Wallet);
WalletScreen.register(WalletScreenModel);
