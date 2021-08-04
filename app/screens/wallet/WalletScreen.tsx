import React, { useEffect } from "react"
import { provider, useInstance } from "react-ioc"
import { Button, Checkbox, Chip, Colors, Dialog, LoaderScreen, Text, View } from "react-native-ui-lib"
import { observer } from "mobx-react-lite"
import { Screen } from "../../components"
import { WalletScreenModel } from "./WalletScreenModel"
import Icon from "react-native-vector-icons/Ionicons"
import { FlatList } from "react-native"
import { runInAction } from "mobx"
import FAIcon from "react-native-vector-icons/FontAwesome5"
import { useStores } from "../../models"


const Wallet = observer(function() {
  const view = useInstance(WalletScreenModel)
  const store = useStores()
  
  useEffect(() => {
    view.init(store)
  }, [])
  
  return (
    <View animated testID="WelcomeScreen" flex>
      <Screen preset="scroll" backgroundColor={ Colors.transparent }>
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
          { view.wallets.map(w => <Text key={ w.address }>{ w.address }</Text>) }
        </View>
      </Screen>
      <View row>
        <FlatList
          data={ [ ...view.wallets ] }
          keyExtractor={ (item) => String(item.address) }
          renderItem={ ({ item }) => (
            <View>
              <Text>
                { item.name }
              </Text>
            </View>
          ) }
        />
      </View>
      <Dialog
        width={ "100%" }
        containerStyle={ { backgroundColor: Colors.grey80 } }
        onDismiss={ () => runInAction(() => view.createWallet.init.display = false) }
        visible={ view.createWallet.init.display }
        bottom
      >
        <View marginH-30 marginV-10>
          <View row marginV-10 center>
            <View flex>
              <Text left h6 bold>{ "Создать кошелек" }</Text>
            </View>
            <View right>
              <Button onPress={ () => runInAction(() => view.createWallet.init.display = false) } link
                      label="Отмена" />
            </View>
          </View>
          { !view.createWallet.pending &&
          <View>
            <Text>{ "На следующем шаге вы увидите 12 слов, из которых вы можете восстановить свой кошелек'," }</Text>
            <View row center paddingV-10>
              <FAIcon color={ Colors.grey20 } size={ 120 } name="shield-alt" />
            </View>
            <View row>
              <Checkbox
                labelStyle={ { width: "90%" } }
                onValueChange={ (val) => runInAction(() => view.createWallet.init.accept = val) }
                value={ view.createWallet.init.accept }
                label={ "Я понимаю, что если потеряю секретную фразу из 12 слов, то не смогу восстановить кошелек " } />
            </View>
            <Button
              disabled={ !view.createWallet.init.accept }
              fullWidth
              onPress={ view.createWalletProceed }
              label={ "Создать" } />
          </View>
          }
          {
            view.createWallet.pending &&
            <View marginH-30 marginV-10 height={ 200 }><LoaderScreen color={ Colors.grey20 } /></View>
          }
        </View>
      </Dialog>
      <Dialog
        width={ "100%" }
        containerStyle={ { backgroundColor: Colors.grey80 } }
        onDismiss={ view.saveWallet }
        visible={ view.createWallet.proceed.display }
        bottom
      >
        <View marginH-30 marginV-10>
          <View row marginV-10 center>
            <View flex>
              <Text left h6 bold>{ "Ваша сид фраза" }</Text>
            </View>
            <View right>
              <Button onPress={ view.saveWallet } link
                      label="Сохранить" />
            </View>
          </View>
          <View center paddingV-10>
            <Text>{ "Кошелек успешно создан" }</Text>
            <Text>{ "Сохраните сид фразу в надежном месте, с помощью нее вы сможете восстановить Ваш кошелек" }</Text>
          </View>
          <View center row paddingV-10>
            {
              view.createWallet.proceed.wallet.mnemonic.split(" ")
                .slice(0, 3)
                .map((l, i) => <Chip key={ l + i } label={ l } />)
            }
          </View>
          <View center row paddingV-10>
            {
              view.createWallet.proceed.wallet.mnemonic.split(" ")
                .slice(4, 7)
                .map((l, i) => <Chip key={ l + i } label={ l } />)
            }
          </View>
          <View center row paddingV-10 paddingB-30>
            {
              view.createWallet.proceed.wallet.mnemonic.split(" ")
                .slice(8, 11)
                .map((l, i) => <Chip key={ l + i } label={ l } />)
            }
          </View>
        </View>
      </Dialog>
    </View>
  )
})

export const WalletScreen = provider()(Wallet)
WalletScreen.register(WalletScreenModel)
