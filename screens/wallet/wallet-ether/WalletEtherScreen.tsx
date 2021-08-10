import React, { useEffect } from "react"
import { provider, useInstance } from "react-ioc"
import { Button, Card, Colors, Text, View } from "react-native-ui-lib"
import { observer } from "mobx-react-lite"
import { Screen } from "../../../components"
import { WalletEtherScreenModel } from "./WalletEtherScreenModel"
import FAIcon from "react-native-vector-icons/FontAwesome5"


const WalletEther = observer<{ route: any }>(function({ route }) {
  const view = useInstance(WalletEtherScreenModel)
  
  useEffect(() => {
    view.init(route.params.wallet)
  }, [])
  
  return (
    <View testID="WelcomeScreen" flex>
      { view.initialized &&
      <Screen statusBar={ "light-content" } preset="scroll" backgroundColor={ Colors.dark80 }>
        <Text h5 bold marginV-20 center grey20>{ view.wallet.formatAddress }</Text>
        <View>
          <Card margin-10 marginB-0 padding-20 animated>
            <View row flex>
              <View flex-8>
                <View row flex>
                  <View>
                    <Text dark40 bold>ETH</Text>
                  </View>
                  <View paddingL-10>
                    <Text dark40>{ view.wallet.formatAddress }</Text>
                  </View>
                </View>
                <View row flex>
                  <Text dark20 h4 bold>{ view.wallet.formatBalance }</Text>
                </View>
              </View>
              <View flex-1 center right>
                <Button
                  round backgroundColor={ Colors.grey60 }>
                  <FAIcon name={ "ellipsis-v" } />
                </Button>
              </View>
            </View>
          </Card>
          <View row>
            <View row center flex-5>
              <Card margin-10 flex padding-10 animated center>
                <FAIcon.Button backgroundColor="white" color={ Colors.grey20 } size={ 16 } name={ "paper-plane" }>
                  <Text center bold dark20>Отправить</Text>
                </FAIcon.Button>
              </Card>
            </View>
            <View row center flex-5>
              <Card flex margin-10 padding-10 animated center>
                <FAIcon.Button backgroundColor="white" color={ Colors.grey20 } size={ 16 }
                               name={ "paper-plane" }>
                  <Text transparent center bold dark20>Получить</Text>
                </FAIcon.Button>
              </Card>
            </View>
          </View>
        </View>
      </Screen> }
    </View>
  )
})

export const WalletEtherScreen = provider()(WalletEther)
WalletEtherScreen.register(WalletEtherScreenModel)
