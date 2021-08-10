import { Button, Checkbox, Colors, Dialog, LoaderScreen, Text, View } from "react-native-ui-lib"
import { runInAction } from "mobx"
import React from "react"
import { useInstance } from "react-ioc"
import { WalletScreenModel } from "../WalletScreenModel"
import FAIcon from "react-native-vector-icons/FontAwesome5"
import { observer } from "mobx-react-lite"

export const CreateWalletDialog = observer(() => {
  const view = useInstance(WalletScreenModel)
  return <Dialog
    width={ "100%" }
    containerStyle={ { backgroundColor: Colors.grey80 } }
    onDismiss={ () => runInAction(() => view.walletDialogs.init.display = false) }
    visible={ view.walletDialogs.init.display }
    bottom
  >
    <View marginH-30 marginV-10>
      <View row marginV-10 center>
        <View flex>
          <Text left h6 bold>{ "Создать кошелек" }</Text>
        </View>
        <View right>
          <Button onPress={ () => runInAction(() => view.walletDialogs.init.display = false) } link
                  label="Отмена" />
        </View>
      </View>
      { !view.walletDialogs.pending &&
      <View>
        <Text>{ "На следующем шаге вы увидите 12 слов, из которых вы можете восстановить свой кошелек'," }</Text>
        <View row center paddingV-10>
          <FAIcon color={ Colors.grey20 } size={ 120 } name="shield-alt" />
        </View>
        <View row>
          <Checkbox
            labelStyle={ { width: "90%" } }
            onValueChange={ (val) => runInAction(() => view.walletDialogs.init.accept = val) }
            value={ view.walletDialogs.init.accept }
            label={ "Я понимаю, что если потеряю секретную фразу из 12 слов, то не смогу восстановить кошелек " } />
        </View>
        <Button
          disabled={ !view.walletDialogs.init.accept }
          fullWidth
          onPress={ view.createWalletProceed }
          label={ "Создать" } />
      </View>
      }
      {
        view.walletDialogs.pending &&
        <View marginH-30 marginV-10 height={ 200 }><LoaderScreen color={ Colors.grey20 } /></View>
      }
    </View>
  </Dialog>
})
