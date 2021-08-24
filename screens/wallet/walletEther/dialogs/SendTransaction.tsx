import { Button, Colors, Dialog, LoaderScreen, Text, View } from "react-native-ui-lib"
import { runInAction } from "mobx"
import React from "react"
import { useInstance } from "react-ioc"
import { observer } from "mobx-react-lite"
import { WalletEtherScreenModel } from "../WalletEtherScreenModel"

export const CreateWalletDialog = observer(() => {
  const view = useInstance(WalletEtherScreenModel)
  return <Dialog
    width={ "100%" }
    containerStyle={ { backgroundColor: Colors.grey80 } }
    onDismiss={ () => runInAction(() => view.walletDialogs.send.display = false) }
    visible={ view.walletDialogs.send.display }
    bottom
  >
    <View marginH-30 marginV-10>
      <View row marginV-10 center>
        <View flex>
          <Text left h6 bold>{ "Создать кошелек" }</Text>
        </View>
        <View right>
          {/* eslint-disable-next-line no-return-assign */}
          <Button onPress={ () => runInAction(() => view.walletDialogs.send.display = false) } link
                  label="Отмена" />
        </View>
      </View>
      { !view.walletDialogs.pending &&
      <View>
        <Button
          disabled={ view.sendDisabled }
          fullWidth
          onPress={ view.sendTransaction }
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
