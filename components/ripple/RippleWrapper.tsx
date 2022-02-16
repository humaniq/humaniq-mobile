import React, { ReactNode } from "react";
import { Colors } from "react-native-ui-lib";
import Ripple from "react-native-material-ripple";
import { ViewStyle } from "react-native";
import { Shadow } from "react-native-shadow-2";

export interface RippleWrapperProps {
    children: ReactNode
    onClick: () => void
    style?: ViewStyle
    borderRadius?: number
    rippleColor?: string
    backgroundColor?: string
    testID?: string
}

/**
 * A wrapper class above Ripple component
 * with shadows and some predefined styles
 *
 * @param children - React Node
 * @param onClick - Callback function
 * @param style - Additional style for wrapper component
 * @param borderRadius - Wrapper border radius
 * @param rippleColor - Ripple animation color
 * @param backgroundColor - Background color
 * @param testID - Id for testing purposes
 * @constructor
 */
export const RippleWrapper = ({
                                  children,
                                  onClick,
                                  style = {},
                                  borderRadius = 12,
                                  rippleColor = Colors.primary,
                                  backgroundColor = Colors.white,
                                  testID
                              }: RippleWrapperProps) => {
    return <Shadow distance={ 10 } radius={ 15 } startColor={ Colors.rgba(Colors.primary, 0.03) }
                   viewStyle={ { alignSelf: "stretch" } }
                   containerViewStyle={ { ...style, backgroundColor, borderRadius } }>
        <Ripple testID={ testID } style={ { borderRadius, overflow: "hidden" } }
                rippleColor={ rippleColor }
                onPress={ onClick }>
            { children }
        </Ripple>
    </Shadow>
}