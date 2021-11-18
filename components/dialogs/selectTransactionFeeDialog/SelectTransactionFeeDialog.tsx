import React from "react";
import { observer } from "mobx-react-lite";
import { ActionSheet, Avatar, Button, Colors, RadioButton, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { useInstance } from "react-ioc";
import { SelectTransactionFeeDialogViewModel } from "./SelectTransactionFeeDialogViewModel";
import Ripple from "react-native-material-ripple"

export const SelectTransactionFeeDialog = observer(() => {
  const view = useInstance(SelectTransactionFeeDialogViewModel)
  return <ActionSheet visible={ view.display }
                      dialogStyle={ {
                        borderTopRightRadius: 30,
                        borderTopLeftRadius: 30,
                        paddingBottom: 10,
                      } }
                      options={ view.options }
                      renderTitle={ () =>
                          <TouchableOpacity onPressIn={ () => {
                            view.display = false
                          } }>
                            <View paddingV-2 center>
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
                              <View>
                                <Text>dfd</Text>
                                <Text>dfd</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                      }
                      renderAction={ (option, index, onOptionPress) => {
                        return <Ripple onPress={ () => onOptionPress(index) } key={ index }>
                          <View paddingH-30 paddingV-20 row width={ '100%' } spread>
                            <View row flex-1>
                              <Avatar imageStyle={ { height: 24, width: 24, position: "absolute", left: 10, top: 10 } }
                                      backgroundColor={ Colors.greyLight } size={ 44 }
                                  // source={ (option.label as any).icon }
                              >
                                { (option.label as any).icon }
                              </Avatar>
                            </View>
                            <View row flex-5 centerV>
                              <Text text16 robotoM>{ (option.label as any).name }</Text>
                            </View>
                            <RadioButton selected={ (option.label as any).data === view.selected }/>
                          </View></Ripple>
                      } }
                      onDismiss={ () => {
                        view.display = false
                      } }
  />
})