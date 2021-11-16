import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Colors, Text, TouchableOpacity } from "react-native-ui-lib";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import CROSS from "../../assets/icons/cross.svg"
import { isDarkMode } from "../../utils/ui";
import { useNavigation } from "@react-navigation/native";

export enum ICON_HEADER {
  CROSS = 'cross',
  ARROW = 'arrow'
}

export interface HeaderProps {
  title?: string;
  rightText?: string,
  icon?: ICON_HEADER
}

export const Header = observer<HeaderProps>((
    {
      title,
      rightText,
      icon = ICON_HEADER.ARROW
    }) => {

  const [ isDark, setDark ] = useState(false)
  const [ canGoBack, setBack ] = useState(true)

  const nav = useNavigation()

  useEffect(() => {
    setDark(isDarkMode())
    setBack(nav.canGoBack())
  }, [ title ])

  const props = rightText ? { spread: true } : {}

  return <TouchableOpacity padding-20 paddingB-0 left row centerV onPress={ canGoBack && nav.goBack } { ...props }>
    { canGoBack && icon === ICON_HEADER.ARROW ?
        <ArrowLeft height={ 16 } width={ 16 } style={ { color: isDark ? Colors.grey50 : Colors.black } }/> :
        <CROSS height={ 14 } width={ 14 } style={ { color: isDark ? Colors.grey50 : Colors.black } }/> }
    { title && <Button onPress={ canGoBack && nav.goBack } paddingL-30 link textM black text20 label={ title }/> }
    { rightText && <Text robotoR text-grey>{ rightText }</Text> }
  </TouchableOpacity>;
});
