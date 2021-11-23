import React from "react";
import { observer } from "mobx-react-lite";
import { ActionSheet, Avatar, Colors, Text, View } from "react-native-ui-lib";
import { useInstance } from "react-ioc";
import { SelectTransactionFeeDialogViewModel } from "./SelectTransactionFeeDialogViewModel";
import Ripple from "react-native-material-ripple"
import { t } from "../../../i18n";
import { currencyFormat } from "../../../utils/number";
import { DialogHeader } from "../dialogHeader/DalogHeader";

export const SelectTransactionFeeDialog = observer(() => {

  const view = useInstance(SelectTransactionFeeDialogViewModel)
  return <ActionSheet visible={ view.display }
                      dialogStyle={ {
                        borderTopRightRadius: 30,
                        borderTopLeftRadius: 30,
                        paddingBottom: 16,
                      } }
                      options={ view.options }
                      renderTitle={ () =>
                          <>
                            <DialogHeader onPressIn={ () => {
                              view.display = false
                            } }/>
                            <View center padding-16>
                              <Text text16 black robotoM>{ t("selectTransactionFeeDialog.name") }</Text>
                              <Text textGrey robotoR> { t("selectTransactionFeeDialog.description") }</Text>
                            </View>
                          </>
                      }
                      renderAction={ (option, index, onOptionPress) => {
                        return <Ripple onPress={ () => onOptionPress(index) } key={ index }>
                          <View paddingH-16 paddingV-10 row width={ '100%' } spread>
                            <View flex-1>
                              <Avatar imageStyle={ { height: 24, width: 24, position: "absolute", left: 10, top: 10 } }
                                      backgroundColor={ Colors.greyLight } size={ 44 }
                                  // source={ (option.label as any).icon }
                              >
                                { (option.label as any).icon }
                              </Avatar>
                            </View>
                            <View flex-5 paddingL-25 centerV left>
                              <View>
                                <Text black text16 robotoM>{ (option.label as any).name }</Text>
                              </View>
                              <View paddingT-5>
                                <Text text14 robotoR textGrey>{ `< ${ (option.label as any).time } min` }</Text>
                              </View>
                            </View>
                            <View flex-4 centerV right>
                              <View>
                                <Text black text16
                                      robotoM>{ currencyFormat(`${ (option.label as any).feeFiat }`) }</Text>
                              </View>
                              <View paddingT-5>
                                <Text text14 robotoR textGrey>{ `${ (option.label as any).fee } ETH` }</Text>
                              </View>
                            </View>
                          </View>
                          <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 70 } }/>
                        </Ripple>
                      } }
                      onDismiss={ () => {
                        view.display = false
                      } }
  />
})