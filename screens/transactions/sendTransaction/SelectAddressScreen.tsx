import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Colors, Text, TextField, TouchableOpacity, View } from "react-native-ui-lib";
import { useInstance } from "react-ioc";
import { SendTransactionViewModel } from "./SendTransactionViewModel";
import { Screen } from "../../../components";
import ArrowIcon from "../../../assets/icons/arrow-left.svg";
import { t } from "../../../i18n";
import { useNavigation } from "@react-navigation/native";
import CameraIcon from '../../../assets/icons/camera.svg'

export const SelectAddressScreen = observer(() => {
  const view = useInstance(SendTransactionViewModel)
  const nav = useNavigation()
  const inputRef = useRef()

  useEffect(() => {
    console.log(inputRef.current?.isFocused())
  }, [ inputRef.current ])

  return <Screen
      backgroundColor={ Colors.white }
      statusBarBg={ Colors.white }
  >
    <TouchableOpacity padding-20 paddingB-0 left row centerV spread onPress={ () => {
      nav.goBack();
      view.closeDialog()
    } }>
      <ArrowIcon height={ 16 } width={ 16 } style={ { color: Colors.primary } }/>
      <Text robotoR text-grey>{ t('selectValueScreen.step2') }</Text>
    </TouchableOpacity>
    <View padding-16>
      <TextField
          onChangeText={ (val) => {
            view.txData.to = val
          } }
          value={ view.txData.to }
          ref={ inputRef }
          hideUnderline
          floatingPlaceholder
          rightButtonProps={{
            iconSource: CameraIcon,
          }}
          rightIconStyle={{
            size: 30,
            width: 30,
            height: 30
          }}
          floatingPlaceholderStyle={ !view.txData.to ? {
            left: 15,
            top: 13,
            fontFamily: "Roboto-Medium"
          } : {} }
          floatingPlaceholderColor={ {
            focus: Colors.primary,
            error: Colors.error,
            default: Colors.primary,
            disabled: Colors.primary
          } }
          placeholder={ "Address" }
          style={ {
            padding: 10,
            borderRadius: 5,
            borderColor: Colors.primary
          } }
      />
    </View>
  </Screen>
})