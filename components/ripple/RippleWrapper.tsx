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
 * @constructor
 */
export const RippleWrapper = ({
                                  children,
                                  style,
                                  onClick,
                                  borderRadius = 50,
                                  rippleColor = Colors.primary
                              }: RippleWrapperProps) => {
    return <Ripple style={ { borderRadius: borderRadius, overflow: "hidden", ...style } }
                   rippleColor={ rippleColor }
                   onPress={ onClick }>
        { children }
    </Ripple>
}