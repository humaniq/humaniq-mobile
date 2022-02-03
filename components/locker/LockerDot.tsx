import { Colors, View } from "react-native-ui-lib";
import React from "react";

export interface LockerDotProps {
    size?: number;
    borderRadius?: number;
    backgroundColor: string;
}

export const LockerDot = ({ size = 18, borderRadius = 10, backgroundColor = Colors.grey }: LockerDotProps) => {
    return <View marginH-10 style={ {
        width: size,
        height: size,
        borderRadius,
        backgroundColor
    } }/>
}