import { Button, Chip, Colors, Dialog, Text, View } from "react-native-ui-lib"
import React from "react"
import { useInstance } from "react-ioc"
import { WalletScreenModel } from "../WalletScreenModel"
import { observer } from "mobx-react-lite"

export const SaveWalletDialog = observer(() => {
  const view = useInstance(WalletScreenModel)
  
  return <Dialog
    width={ "100%" }
    containerStyle={ { backgroundColor: Colors.grey80 } }
    onDismiss={ view.saveWallet }
    visible={ view.walletDialogs.proceed.display }
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
          view.walletDialogs.proceed.wallet.mnemonic.split(" ")
            .slice(0, 4)
            .map((l, i) => <Chip marginH-5 key={ l + i } label={ l } />)
        }
      </View>
      <View center row paddingV-10>
        {
          view.walletDialogs.proceed.wallet.mnemonic.split(" ")
            .slice(4, 8)
            .map((l, i) => <Chip marginH-5 key={ l + i } label={ l } />)
        }
      </View>
      <View center row paddingV-10 paddingB-30>
        {
          view.walletDialogs.proceed.wallet.mnemonic.split(" ")
            .slice(8, 12)
            .map((l, i) => <Chip marginH-5 key={ l + i } label={ l } />)
        }
      </View>
    </View>
  </Dialog>
})
