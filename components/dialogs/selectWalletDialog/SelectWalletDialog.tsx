import { observer } from "mobx-react-lite"
import { ActionSheet, Button, Colors, RadioButton, Text, TouchableOpacity, View } from "react-native-ui-lib"
import React from "react"
import { useInstance } from "react-ioc"
import { SelectWalletDialogViewModel } from "./SelectWalletDialogViewModel"
import Ripple from "react-native-material-ripple"
import { getWalletStore } from "../../../App"

export const SelectWalletDialog = observer(() => {
  const view = useInstance(SelectWalletDialogViewModel)
  return <ActionSheet
      renderTitle={ () =>
          <TouchableOpacity onPressIn={ () => {
            view.display = false
          } }>
            <View row paddingV-2 center>
              <View flex center paddingH-20 paddingV-5>
                <Button onPressIn={ () => {
                  view.display = false
                } }
                        avoidInnerPadding avoidMinWidth
                        style={ {
                          padding: 4,
                          paddingHorizontal: 20,
                          backgroundColor: Colors.grey40
                        } }/>
              </View>
            </View>
          </TouchableOpacity>
      }
      dialogStyle={ { borderTopRightRadius: 30, borderTopLeftRadius: 30, paddingBottom: 10 } }
      options={ view.options }
      visible={ view.display }
      renderAction={ (option, index, onOptionPress) => {
        return <Ripple onPress={ () => onOptionPress(index) } key={ index }>
          <View paddingH-30 paddingV-20 row width={ '100%' } spread>
            <View row>
              <Text text60 primary>{ (option.label as any).address }</Text>
              <Text marginL-10 text70 grey40>{ `≈${ (option.label as any).balance }` }</Text>
            </View>
            <RadioButton selected={ index === getWalletStore().selectedWalletIndex }/>
          </View></Ripple>
      } }
      onDismiss={ () => { view.display = false } }
  />
})
