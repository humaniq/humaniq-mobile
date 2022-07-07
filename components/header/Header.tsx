import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Colors, Text, TouchableOpacity } from "react-native-ui-lib";
import { isDarkMode } from "../../utils/ui";
import { useNavigation } from "@react-navigation/native";
import { HIcon } from "../icon";

export enum ICON_HEADER {
    CROSS = 'cross',
    ARROW = 'arrow'
}

export interface HeaderProps {
    title?: string
    rightText?: string
    icon?: ICON_HEADER
    onBackPress?: () => void
    backEnabled?: boolean
    backPressEnabled?: boolean
    labelSize?: number
}

export const Header = observer<HeaderProps>((
    {
        title,
        rightText,
        icon = ICON_HEADER.ARROW,
        onBackPress,
        backEnabled = true,
        backPressEnabled = true,
        labelSize = 20
    }) => {

    const [ isDark, setDark ] = useState(false)
    const [ canGoBack, setBack ] = useState(true)

    const nav = useNavigation()

    const goBack = () => {
        if (!backPressEnabled) return
        if (onBackPress || canGoBack) nav.goBack()
    }

    useEffect(() => {
        setDark(isDarkMode())
        setBack(nav.canGoBack())
    }, [ title ])

    const props = rightText ? { spread: true } : {}

    return <TouchableOpacity activeOpacity={ backPressEnabled ? 0.2 : 1 } testID={ 'backBtn' } padding-20 paddingB-0 left row centerV
                             onPress={ goBack } { ...props }>
        { backEnabled && canGoBack && icon === ICON_HEADER.ARROW ?
            <HIcon name={ "arrow-left" } size={ 16 } color={ { color: isDark ? Colors.grey50 : Colors.black } }/> :
            backEnabled &&
            <HIcon name={ "cross" } size={ 14 } color={ { color: isDark ? Colors.grey50 : Colors.black } }/> }
        { title ? <Text marginL-30={ backEnabled } style={ { fontSize: labelSize } } textM color={ Colors.black }>
            { title }
        </Text> : null }
        { rightText && <Text robotoR text-grey>{ rightText }</Text> }
    </TouchableOpacity>;
});
