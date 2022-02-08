import { Colors, View } from "react-native-ui-lib";
import React from "react";

export interface LockerDotProps {
    size?: number;
    borderRadius?: number;
    bgColor: string;
}

export const LockerDot = ({ size = 18, borderRadius = 10, bgColor = Colors.grey }: LockerDotProps) => {
    return <View marginH-10 style={ {
        width: size,
        height: size,
        borderRadius,
        backgroundColor: bgColor
    } }/>
}