import React, { ReactNode } from "react";
import { Colors } from "react-native-ui-lib";
import Ripple from "react-native-material-ripple";
import { ViewStyle } from "react-native";
import { Shadow } from "react-native-shadow-2";

export interface RippleWrapperProps {
    children: ReactNode
    style?: ViewStyle
    onClick: () => void
    borderRadius?: number
    rippleColor?: string
    backgroundColor?: string
    testID?: string
}

/**
 * A wrapper class above Ripple component
 * with some predefined styles
 *
 * @param children
 * @param style
 * @param onClick
 * @param borderRadius
 * @param rippleColor
 * @param backgroundColor
 * @param testID
 * @constructor
 */
export const RippleWrapper = ({
                                  children,
                                  style = {},
                                  onClick,
                                  borderRadius = 12,
                                  rippleColor = Colors.primary,
                                  backgroundColor = Colors.white,
                                  testID
                              }: RippleWrapperProps) => {
    return <Shadow distance={ 10 } radius={ 15 } startColor={ Colors.rgba(Colors.black, 0.03) }
                   viewStyle={ { alignSelf: "stretch" } }
                   containerViewStyle={ { ...style, backgroundColor, borderRadius } }>
        <Ripple testID={ testID } style={ { borderRadius, overflow: "hidden" } }
                rippleColor={ rippleColor }
                onPress={ onClick }>
            { children }
        </Ripple>
    </Shadow>
}