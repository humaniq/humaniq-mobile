import React from "react";
import { Colors, TouchableOpacity } from "react-native-ui-lib";
import { HIcon } from "../icon";

export interface CheckBtnProps {
    uncheckedColor?: string
    checked?: boolean
    onPress?: (val: boolean) => void
}

export const CheckBtn: React.FC<CheckBtnProps> = ({ checked, onPress, uncheckedColor= Colors.primary, }) => {
    if (checked) return <TouchableOpacity
        onPress={ () => onPress(checked) }
        style={ {
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: Colors.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        } }><HIcon
        color={ Colors.white } name={ "done" }/></TouchableOpacity>
    return <TouchableOpacity
        onPress={ () => onPress(checked) }
        style={ { width: 20, height: 20, borderRadius: 10, borderColor: uncheckedColor, borderWidth: 2 } }/>
}