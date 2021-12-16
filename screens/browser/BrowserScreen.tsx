import React from "react";
import { observer } from "mobx-react-lite";
import { Colors, Text, View } from "react-native-ui-lib";
import { provider } from "react-ioc";
import { BrowserScreenViewModel } from "./BrowserScreenViewModel";
import { Screen } from "../../components";

const Browser = observer(() => {
  return <Screen backgroundColor={ Colors.grey70 } statusBarBg={ Colors.grey70 }
                 preset="scroll"
                 style={ { height: "100%" } }
  >
    <View>
      <Text>ddddd</Text>
    </View>
  </Screen>
})

export const BrowserScreen = provider()(Browser)
BrowserScreen.register(BrowserScreenViewModel)