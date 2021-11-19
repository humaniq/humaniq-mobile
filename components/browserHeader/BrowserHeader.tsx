import React, { useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Button, Colors, Image, Text, TextField, TouchableOpacity, View } from "react-native-ui-lib"
import { RootNavigation } from "../../navigators"
import Ripple from "react-native-material-ripple"
import { t } from "../../i18n"
import { Dimensions } from "react-native"
import { HIcon } from "../icon";

export interface HeaderProps {
  title: string;
  url: string;
  icon: string
  backButton?: boolean;
  onPressMenu?: (any) => any | Promise<any>;
  onPressSearch?: (any) => any | Promise<any>
  isSearchMode: boolean,
  onSearchSubmit?: (val: string) => any | Promise<any>
}

export const BrowserHeader = observer<HeaderProps>((
    {
      title,
      url,
      icon,
      backButton = true,
      onPressMenu = true,
      onPressSearch,
      isSearchMode,
      onSearchSubmit,
    }) => {

  const inputRef = useRef()

  useEffect(() => {
    // @ts-ignore
    inputRef?.current?.focus()
    if (!isSearchMode) {
      setValue("")
    }
  }, [ isSearchMode ])

  const [ value, setValue ] = useState("")

  const isHttps = url && new URL(url).protocol === "https:"
  return <View flex row center>
    <View flex-1 left>
      <TouchableOpacity paddingL-20 center onPress={ RootNavigation.goBack }>
        { backButton && <HIcon name={ "arrow-left" } size={ 24 } color="#0066DA"/> }
      </TouchableOpacity>
    </View>
    <View marginH-10 flex-8 row style={ isSearchMode && { backgroundColor: Colors.white, borderRadius: 20 } }>
      <View marginR-15>
        <Ripple onPress={ onPressSearch } rippleContainerBorderRadius={ 20 } rippleColor={ Colors.primary }>
          <Button style={ { height: 40, width: 40 } } round
                  backgroundColor={ isSearchMode ? Colors.white : Colors.grey70 }>
            <HIcon name={ "search" } size={ 20 } color="#0066DA"/>
          </Button></Ripple>
      </View>
      <View left>
        {
          isSearchMode && <View flex row>
              <TextField width={ Dimensions.get('window').width * 0.5 } autoCapitalize='none' hideUnderline style={ {
                padding: 0,
                margin: 0,
                height: 40,
                fontWeight: "bold",
                color: Colors.grey30,
                overflow: 'hidden'
              } }
                         onSubmitEditing={ () => onSearchSubmit(value) }
                         ref={ inputRef }
                         onChangeText={ setValue }
                         value={ value }
                         placeholder={ t("browserScreen.searchPlaceholder") }/>
          </View>
        }
        {
          !isSearchMode && <>
              <View left>
                  <View center>
                      <Text numberOfLines={ 1 } bold primary>{ title || "" }</Text>
                  </View>
                  <View center>
                      <View row center>
                        { !!icon &&
                        <Image key={ icon } marginR-4 height={ 16 } width={ 16 }
                               style={ { height: 16, width: 16 } }
                               source={ { uri: icon } }/> }
                        { !!url && <Text grey20 marginR-4> { new URL(url).host }</Text> }
                        { !!isHttps && <HIcon name={ "search" } size={ 12 } color="#0066DA"/> }
                      </View>
                  </View>
              </View>
          </>
        }
      </View>
    </View>
    <View flex-1 right marginR-20>
      { onPressMenu &&
      <Ripple onPress={ onPressMenu } rippleContainerBorderRadius={ 20 } rippleColor={ Colors.primary }>
          <Button style={ { height: 40, width: 40 } } round backgroundColor={ Colors.grey70 }>
              <HIcon name={ "redo-alt" } size={ 20 } color={ Colors.primary }/>
          </Button></Ripple> }
    </View>
  </View>
})
