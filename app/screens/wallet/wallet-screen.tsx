import React from "react"
import { SafeAreaView, TextStyle, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, Wallpaper } from "../../components"
import { color } from "../../theme"
import styles from "./styles"


export const WalletScreen = observer(function () {
  const navigation = useNavigation()
  const nextScreen = () => navigation.navigate("demo")
  
  return (
    <View testID="WelcomeScreen" style={ styles.full }>
      <Wallpaper />
      <Screen style={ styles.container } preset="scroll" backgroundColor={ color.transparent }>
        <Header headerTx="welcomeScreen.poweredBy" style={ styles.header }
                titleStyle={ styles.headerTitle as TextStyle } />
      </Screen>
      <SafeAreaView style={ styles.footer }>
        <View style={ styles.footerContent }>
          <Button
            testID="next-screen-button"
            style={ styles.continue }
            textStyle={ styles.continueText as TextStyle }
            tx="welcomeScreen.continue"
            onPress={ nextScreen }
          />
        </View>
      </SafeAreaView>
    </View>
  )
})
