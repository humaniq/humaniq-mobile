import { observer } from "mobx-react-lite"
import { ActionSheet, Avatar, Button, Colors, RadioButton, Text, TouchableOpacity, View } from "react-native-ui-lib"
import React from "react"
import { useInstance } from "react-ioc"
import { SelectWalletDialogViewModel } from "./SelectWalletDialogViewModel"
import Ripple from "react-native-material-ripple"
import { getWalletStore } from "../../../App"
import { HIcon } from "../../icon";

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
          <View padding-10 paddingH-15 paddingR-20>
            <View row centerV>
              <View flex-2>
                {
                  <Avatar size={ 44 } backgroundColor={ Colors.greyLight }>
                    <HIcon name={ "wallet" } size={ 20 } style={ { color: Colors.primary } }/>
                  </Avatar>
                }
              </View>
              <View flex-6>
                <Text numberOfLines={ 1 } textM text16 black>{ (option.label as any).address }</Text>
                <Text numberOfLines={ 1 } text14 robotoR textGrey>
                  { (option.label as any).balance }
                </Text>
              </View>
              <View flex-3 right>
                <RadioButton size={ 20 }
                             color={ index !== getWalletStore().selectedWalletIndex ? Colors.textGrey : Colors.primary }
                             selected={ index === getWalletStore().selectedWalletIndex }/>
              </View>

            </View>
            { index !== 0 && <View absR style={ {
              borderWidth: 1,
              borderColor: Colors.grey,
              width: "90%",
              borderBottomColor: "transparent"
            } }/> }
          </View>
        </Ripple>
      } }
      onDismiss={ () => {
        view.display = false
      } }
  />
})