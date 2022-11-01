import { observer } from "mobx-react-lite"
import { provider, useInstance } from "react-ioc"
import React, { useEffect } from "react"
import { Colors, Text, View } from "react-native-ui-lib"
import { Button } from "react-native"
import "app/theme/color"
import "app/theme/typography"
import { AppService } from "app/services/AppService"
import { applyTheme } from "app/theme/componentTheme"

applyTheme()

require('react-native-ui-lib/config').setConfig({ appScheme: 'default' })

const AppScreen = observer(() => {

  const app = useInstance(AppService)

  useEffect(() => {
    app.init()
  }, [])

  return <View flex style={{ minHeight: "100%", backgroundColor: Colors.success }}>
    <View flex center>
      <Text>{app.counter}</Text>
      <Button onPress={() => {
        console.log("RRERE")
        app.increment()
      }} title={"Increment"}></Button>
    </View>
  </View>
})

export const App = provider()(AppScreen)
App.register(
  AppService
)
