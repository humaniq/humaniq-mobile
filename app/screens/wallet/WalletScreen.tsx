import React, { useEffect } from "react"
import { provider, useInstance } from "react-ioc"
import { Button, Card, Colors, Text, View } from "react-native-ui-lib"
import { observer } from "mobx-react-lite"
import { Screen } from "../../components"
import { WalletScreenModel } from "./WalletScreenModel"
import Icon from "react-native-vector-icons/Ionicons"
import { runInAction } from "mobx"
import FAIcon from "react-native-vector-icons/FontAwesome5"
import { store } from "../../services/store/Store"
import { CreateWalletDialog } from "./dialogs/CreateWalletDialog"
import { SaveWalletDialog } from "./dialogs/SaveWalletDialog"
import { RemoveWalletDialog } from "./dialogs/RemoveWalletDialog"


const Wallet = observer(function() {
  const view = useInstance(WalletScreenModel)
  
  useEffect(() => {
    view.init()
  }, [])
  
  return (
    <View animated testID="WelcomeScreen" flex>
      { view.initialized &&
      <Screen statusBar={ "light-content" } preset="scroll" backgroundColor={ Colors.transparent }>
        <Text h5 bold marginV-20 center grey20>Кошельки</Text>
        <View center animated flex row padding-20 spread>
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
          { store.walletStore.wallets.map(w => <Card margin-10 padding-20 animated
                                                     key={ w.address }>
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
                <View row flex>
                  <Text dark20 h4 bold>{ w.formatBalance }</Text>
                </View>
              </View>
              <View flex-1 center right>
                <Button
                  onPress={ () => runInAction(() => {
                    view.walletDialogs.menu.display = !view.walletDialogs.menu.display
                    view.walletDialogs.menu.currentWallet = w.address
                  }) }
                  round backgroundColor={ Colors.grey60 }>
                  <FAIcon name={ "ellipsis-v" } />
                </Button>
              </View>
            </View>
          </Card>) }
        </View>
      </Screen> }
      <CreateWalletDialog />
      <SaveWalletDialog />
      <RemoveWalletDialog />
    </View>
  )
})

export const WalletScreen = provider()(Wallet)
WalletScreen.register(WalletScreenModel)
