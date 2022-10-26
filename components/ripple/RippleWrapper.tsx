import React, { ReactNode } from "react";
import { Colors } from "react-native-ui-lib";
import Ripple from "react-native-material-ripple";
import { ViewStyle } from "react-native";

export interface RippleWrapperProps {
    children: ReactNode
    onClick: () => void
    style?: ViewStyle
    disabled?: boolean
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
 * @param disabled - Ignore touches
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
                                  borderRadius = 14,
                                  rippleColor = Colors.white,
                                  disabled = false,
                                  backgroundColor = Colors.transparent,
                                  testID
                              }: RippleWrapperProps) => {
    return <Ripple disabled={ disabled } testID={ testID }
                   style={ { borderRadius, overflow: "hidden", backgroundColor, ...style, } }
                   rippleColor={ rippleColor }
                   onPress={ onClick }>
        { children }
    </Ripple>
}
