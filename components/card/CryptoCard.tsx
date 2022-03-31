import React, { ReactNode } from "react";
import { Colors, View } from "react-native-ui-lib";
import CloudImage from "../../assets/images/clouds.svg";

export interface CryptoCardProps {
    cardColor?: string;
    width?: number;
    height?: number;
    children: ReactNode;
}

export const CryptoCard = ({ children, cardColor = Colors.blueOcean, width = 280, height = 230 }: CryptoCardProps) => {
    return <View marginV-16 marginH-16
                 style={ {
                     borderRadius: 10,
                     overflow: "hidden",
                     backgroundColor: cardColor
                 } }>
        <View absR absB><CloudImage height={ height } width={ width }/></View>
        { children }
    </View>
}