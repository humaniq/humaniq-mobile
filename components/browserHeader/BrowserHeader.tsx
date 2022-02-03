import React, { useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Colors, Hint, Text, TextField, TouchableOpacity, View } from "react-native-ui-lib"
import Ripple from "react-native-material-ripple"
import { HIcon } from "../icon";
import { t } from "../../i18n";
import { CSSShadows } from "../../utils/ui";

export interface HeaderProps {
  title: string;
  url: string;
  icon: string
  reloadPage?: (props?: any) => void
  onPressSearch?: (any) => any | Promise<any>
  isSearchMode: boolean,
  onSearchSubmit?: (val: string) => any | Promise<any>
  searchValue: string
  onValueChange: (val: string) => void
  goHomePage: () => void,
  numOfTabs: number,
  openTabs: () => void
  openNewTab: () => void
  changeAddress: () => void
  changeNetwork: () => void
}

export const BrowserHeader = observer<HeaderProps>((
    {
      title,
      url,
      icon,
      reloadPage,
      onPressSearch,
      isSearchMode,
      onSearchSubmit,
      goHomePage,
      numOfTabs,
      openTabs,
      openNewTab,
      changeAddress,
      changeNetwork,
      onValueChange,
      searchValue = "",
    }) => {

  const inputRef = useRef()

  useEffect(() => {
    // @ts-ignore
    inputRef?.current?.focus()
    if (!isSearchMode) {
      onValueChange("")
    }
  }, [ isSearchMode ])

  const [ visible, setVisible ] = useState(false)

  const isHttps = url && new URL(url).protocol === "https:"

  return <View row center bg-bg paddingV-10>
    { !isSearchMode &&
        <View left paddingH-8>
            <Ripple center onPress={ goHomePage } style={ { padding: 10 } }>
                <HIcon name={ "home" } size={ 20 }/>
            </Ripple>
        </View>
    }
    { !isSearchMode &&
        <TouchableOpacity flex-6 row onPress={ onPressSearch }>
            <View row centerV bg-greyLightSecond paddingH-10 paddingV-10 br30 flexG>
              { !!isHttps && <HIcon name={ "lock-fill" } size={ 14 }/> }
              { !!url && <Text grey20 marginR-4> { new URL(url).host }</Text> }
            </View>
        </TouchableOpacity>
    }
    { isSearchMode &&
        <TouchableOpacity flex-8 row centerV marginL-16 paddingL-10 bg-white br30 paddingV-5 marginR-16
                          style={ CSSShadows }
            // @ts-ignore
                          onPress={ () => inputRef?.current.focus() }
        >
            <TouchableOpacity row flex-1 onPress={ onPressSearch }>
                <HIcon size={ 18 } name={ "arrow-left" }/>
            </TouchableOpacity>
            <View row flex-7>
                <TextField
                    autoCapitalize='none'
                    hideUnderline
                    style={ {
                      fontSize: 14,
                      padding: 0,
                      margin: 0,
                      color: Colors.dark30,
                      overflow: 'hidden',
                    } }
                    onSubmitEditing={ () => onSearchSubmit(searchValue) }
                    ref={ inputRef }
                    onChangeText={ (val) => {
                      onValueChange(val)
                    } }
                    value={ searchValue }
                    placeholder={ t("browserScreen.searchPlaceholder") }
                    enableErrors={ false }
                    selectionColor={ Colors.primary }
                />
            </View>
            <View row flex-2 right>
              { !!searchValue.length && <HIcon style={ { paddingRight: 10, color: Colors.textGrey } } size={ 18 } name={ "circle-xmark-solid" }
                                               onPress={ () => onValueChange("") }/> }
            </View>
        </TouchableOpacity>
    }
    { !isSearchMode &&
        <View flex-1 row center paddingL-10>
            <Ripple
                style={ { padding: 10 } }
                rippleColor={ Colors.primary }
                onPress={ openTabs }
            >
                <View center paddingH-6 paddingV-2
                      style={ { borderColor: Colors.black, borderWidth: 2, borderRadius: 8, width: 24 } }>
                    <Text center text12>
                        { numOfTabs }
                    </Text>
                </View>
            </Ripple>
        </View>
    }
    { !isSearchMode &&
        <View flex-1 center paddingR-8>
            <Hint
                position={ Hint.positions.BOTTOM }
                visible={ visible }
                borderRadius={ 4 }
                color={ Colors.white }
                enableShadow={ true }
                offset={ -50 }
                useSideTip={ false }
                customContent={
                    <View>
                        <TouchableOpacity row centerV left onPress={ () => {
                            setVisible(false);
                            reloadPage()
                        } } paddingV-15 paddingH-5>
                            <HIcon name={ "redo-alt" } size={ 16 }/>
                            <Text marginL-10 text16>{ t("browserScreen.reloadPage") }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity row centerV left onPress={ () => {
                            setVisible(false);
                            openNewTab()
                        } } paddingV-15 paddingH-5>
                            <HIcon name={ "squared-plus" } size={ 16 }/>
                            <Text marginL-10 text16>{ t("browserScreen.openNewTab") }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity row centerV left onPress={ () => {
                            setVisible(false);
                            changeAddress()
                        } } paddingV-15 paddingH-5>
                            <HIcon name={ "wallet-alt" } size={ 16 }/>
                            <Text marginL-10 text16>{ t("browserScreen.changeAddress") }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity row centerV left onPress={ () => {
                            setVisible(false);
                            changeNetwork()
                        } } paddingV-15 paddingH-5>
                            <HIcon name={ "network" } size={ 16 }/>
                            <Text marginL-10 text16>{ t("browserScreen.changeNetwork") }</Text>
                        </TouchableOpacity>
                    </View>
                }
                onBackgroundPress={ () => setVisible(!visible) }
            >
                <View>
                    <Ripple onPress={ () => setVisible(!visible) } rippleContainerBorderRadius={ 20 }
                            rippleColor={ Colors.primary }
                            style={ { padding: 10 } }
                    >
                        <HIcon name={ "circles" } size={ 18 }/>
                    </Ripple>
                </View>
            </Hint>
        </View>
    }
  </View>
})