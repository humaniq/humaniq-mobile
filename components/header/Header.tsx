import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Colors, Text, TouchableOpacity } from "react-native-ui-lib";
import { isDarkMode } from "../../utils/ui";
import { useNavigation } from "@react-navigation/native";
import { HIcon } from "../icon";

export enum ICON_HEADER {
    CROSS = 'cross',
    ARROW = 'arrow'
}

export interface HeaderProps {
    title?: string;
    rightText?: string,
    icon?: ICON_HEADER
    onBackPress?: () => void,
    backEnabled?: boolean
}

export const Header = observer<HeaderProps>((
    {
        title,
        rightText,
        icon = ICON_HEADER.ARROW,
        onBackPress,
        backEnabled = true
    }) => {

    const [ isDark, setDark ] = useState(false)
    const [ canGoBack, setBack ] = useState(true)

    const nav = useNavigation()

    const goBack = () => {
        if (onBackPress || canGoBack) nav.goBack()
    }

    useEffect(() => {
        setDark(isDarkMode())
        setBack(nav.canGoBack())
    }, [ title ])

    const props = rightText ? { spread: true } : {}

    return <TouchableOpacity testID={ 'backBtn' } padding-20 paddingB-0 left row centerV
                             onPress={ goBack } { ...props }>
        { backEnabled && canGoBack && icon === ICON_HEADER.ARROW ?
            <HIcon name={ "arrow-left" } size={ 16 } color={ { color: isDark ? Colors.grey50 : Colors.black } }/> :
            backEnabled &&
            <HIcon name={ "cross" } size={ 14 } color={ { color: isDark ? Colors.grey50 : Colors.black } }/> }
        { title &&
            <Button onPress={ goBack } paddingL-30={ backEnabled } link textM black
                    text20
                    label={ title }/> }
        { rightText && <Text robotoR text-grey>{ rightText }</Text> }
    </TouchableOpacity>;
});
