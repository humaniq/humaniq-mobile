import { Button, Colors, Dialog, Text, View } from "react-native-ui-lib"
import { runInAction } from "mobx"
import React from "react"
import { useInstance } from "react-ioc"
import { WalletScreenModel } from "../WalletScreenModel"
import { observer } from "mobx-react-lite"


export const RemoveWalletDialog = observer(() => {
  const view = useInstance(WalletScreenModel)
  return <Dialog
    width={ "100%" }
    containerStyle={ { backgroundColor: Colors.grey80 } }
    visible={ view.walletDialogs.menu.display }
    bottom
    height={ 200 }
  >
    <View flex flexG-1 marginH-30 marginV-10>
      <View row marginV-10>
        <View flex>
          <Text color={ Colors.dark20 } left h6 bold>{ "Действия" }</Text>
        </View>
        <View right>
          <Button color={ Colors.dark30 } onPress={ view.closeMenuDialog } link
                  label="Закрыть" />
        </View>
      </View>
      <View width={ "100%" } height={ "100%" } row bottom>
        { !view.walletDialogs.menu.deleteConfirmation.display &&
        <View flex paddingB-50>
          <Button fullWidth
                  backgroundColor={ Colors.red30 }
                  onPress={ () => runInAction(() => view.walletDialogs.menu.deleteConfirmation.display = true) }
                  label={ "Удалить" } />
        </View> }
        { view.walletDialogs.menu.deleteConfirmation.display &&
        <View center flex width={ "100%" } paddingB-15>
          <Text>Подтвердите удаление</Text>
          <View row center marginT-40 flex width={ "100%" }>
            <Button
              backgroundColor={ Colors.red30 }
              fullWidth
              onPress={ view.removeWallet }
              marginH-5 label={ "Удалить" } />
            <Button
              backgroundColor={ Colors.dark30 }
              fullWidth
              onPress={ view.closeMenuDialog }
              marginH-5 label={ "Отмена" } />
          </View>
        </View> }
      </View>
    </View>
  </Dialog>
})
