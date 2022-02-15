import React, { ReactNode } from "react";
import { Colors } from "react-native-ui-lib";
import Ripple from "react-native-material-ripple";
import { ViewStyle } from "react-native";

export interface RippleWrapperProps {
    children: ReactNode
    style: ViewStyle
    onClick: () => void
    borderRadius?: number
    rippleColor?: string
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
 * @param testID
 * @constructor
 */
export const RippleWrapper = ({
                                  children,
                                  style,
                                  onClick,
                                  borderRadius = 20,
                                  rippleColor = Colors.primary,
                                  testID
                              }: RippleWrapperProps) => {
    return <Ripple testID={ testID } style={ { borderRadius: borderRadius, overflow: "hidden", ...style } }
                   rippleColor={ rippleColor }
                   onPress={ onClick }>
        { children }
    </Ripple>
}