import React from "react"
import { provider, useInstance } from "react-ioc"
import { SafeAreaView, TextStyle, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, Text, Wallpaper } from "../../components"
import { color } from "../../theme"
import styles from "./styles"
import { WalletScreenModel } from "./WalletScreenModel"


const Wallet = observer(function() {
  const navigation = useNavigation()
  const view = useInstance(WalletScreenModel)
  
  return (
    <View testID="WelcomeScreen" style={ styles.full }>
      
      <Wallpaper />
      <Screen style={ styles.container } preset="scroll" backgroundColor={ color.transparent }>
        <Header headerTx="welcomeScreen.poweredBy" style={ styles.header }
                titleStyle={ styles.headerTitle as TextStyle } />
        <Text style={ styles.text } text={ view.getCounter } />
      </Screen>
      <SafeAreaView style={ styles.footer }>
        <View style={ styles.footerContent }>
          <Button
            testID="next-screen-button"
            style={ styles.continue }
            textStyle={ styles.continueText as TextStyle }
            tx="welcomeScreen.continue"
            onPress={ () => view.increment() }
          />
        </View>
      </SafeAreaView>
    </View>
  )
})

export const WalletScreen = provider()(Wallet)
WalletScreen.register(WalletScreenModel)
