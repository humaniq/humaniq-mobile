import React from "react";
import { observer } from "mobx-react-lite";
import { ActionSheet, Avatar, Button, Colors, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { useInstance } from "react-ioc";
import { SelectTransactionFeeDialogViewModel } from "./SelectTransactionFeeDialogViewModel";
import Ripple from "react-native-material-ripple"
import { t } from "../../../i18n";
import { currencyFormat } from "../../../utils/number";

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
                              <View center padding-16>
                                <Text text16 black robotoM>{ t("selectTransactionFeeDialog.name") }</Text>
                                <Text textGrey robotoR> { t("selectTransactionFeeDialog.description") }</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                      }
                      renderAction={ (option, index, onOptionPress) => {
                        return <Ripple onPress={ () => onOptionPress(index) } key={ index }>
                          <View paddingH-30 paddingV-10 row width={ '100%' } spread>
                            <View flex-2>
                              <Avatar imageStyle={ { height: 24, width: 24, position: "absolute", left: 10, top: 10 } }
                                      backgroundColor={ Colors.greyLight } size={ 44 }
                                  // source={ (option.label as any).icon }
                              >
                                { (option.label as any).icon }
                              </Avatar>
                            </View>
                            <View flex-4 centerV left>
                              <View>
                                <Text black text16 robotoM>{ (option.label as any).name }</Text>
                              </View>
                              <View>
                                <Text text14 robotoR textGrey>{ `< ${ (option.label as any).time } min` }</Text>
                              </View>
                            </View>
                            <View flex-4 centerV right>
                              <View>
                                <Text black text16 robotoM>{ currencyFormat(`${ (option.label as any).feeFiat }`) }</Text>
                              </View>
                              <View>
                                <Text text14 robotoR textGrey>{ `${ (option.label as any).fee } ETH` }</Text>
                              </View>
                            </View>
                          </View>
                          <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 80 } }/>
                        </Ripple>
                      } }
                      onDismiss={ () => {
                        view.display = false
                      } }
  />
})