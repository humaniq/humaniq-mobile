import React, { useEffect, useRef } from "react"
import { Animated, Easing, StyleProp, View, ViewStyle } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { Colors } from "react-native-ui-lib"

const SHIM_DURATION = 900
const SKELETON_COLORS = [ Colors.rgba("#e0e0e0", 0.5), Colors.grey80, "#ebebeb" ]

export interface SkeletonProps {
    /**
     * The width of the skeleton view.
     */
    width?: number;
    /**
     * The height of the skeleton view.
     */
    height?: number;
    /**
     * The border radius of the skeleton view.
     */
    borderRadius?: number;
    /**
     * The duration of shim animation.
     */
    shimDuration?: number;
    /**
     * Whether the shim animation is enabled.
     */
    shimEnabled?: boolean;
    /**
     * List of the gradient colors of the Skeleton view.
     */
    colors?: string[];
    /**
     * The background color of the Skeleton view.
     * If not defined, the first item of the array i.e. colors, will be applied as background color for skeleton view
     */
    backgroundColor?: string;
    /**
     * Skeleton view style.
     */
    wrapperStyle?: StyleProp<ViewStyle>;
}

/**
 * Skeleton view with shimming animation.
 *
 * @param width
 * @param height
 * @param borderRadius
 * @param wrapperStyle
 * @param shimDuration
 * @param shimEnabled
 * @param colors
 * @param backgroundColor
 * @constructor
 */
export const Skeleton = ({
                             width = 40,
                             height = 20,
                             borderRadius = 0,
                             shimDuration = SHIM_DURATION,
                             shimEnabled = true,
                             colors = SKELETON_COLORS,
                             wrapperStyle = {},
                             backgroundColor
                         }: SkeletonProps) => {
    const bgColor = backgroundColor || colors[0]
    const shimAnimation = useRef(new Animated.Value(-1)).current

    useEffect(() => {
        let animatedValue

        if (shimEnabled) {
            animatedValue = Animated.loop(
                Animated.timing(shimAnimation, {
                    toValue: 1,
                    duration: shimDuration,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
            )
            animatedValue.start();
        }

        return () => {
            if (shimEnabled) {
                animatedValue.stop()
            }
        }
    }, [])

    return (
        <View style={ [ { overflow: 'hidden', width, height, borderRadius }, wrapperStyle ] }>
            <View style={ {
                flex: 1,
                overflow: 'hidden',
                backgroundColor: bgColor,
            } }>
                <Animated.View style={ {
                    flex: 1,
                    transform: [ {
                        translateX: shimAnimation.interpolate({
                            inputRange: [ -1, 1 ],
                            outputRange: [ -width, width ],
                        })
                    } ]
                } }>
                    <LinearGradient
                        colors={ colors }
                        style={ { flex: 1, width } }
                        start={ {
                            x: -1,
                            y: 0.5,
                        } }
                        end={ {
                            x: 2,
                            y: 0.5,
                        } }
                        locations={ [ 0.3, 0.5, 0.7 ] }/>
                </Animated.View>
            </View>
        </View>
    );
};