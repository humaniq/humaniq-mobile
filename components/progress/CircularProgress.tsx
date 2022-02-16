import React, { useRef, useEffect, ReactNode } from 'react';
import {
    Easing,
    Animated,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { Colors } from "react-native-ui-lib";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text)

export interface CircularProgressProps {
    currentValue?: number
    radius?: number
    strokeWidth?: number
    duration?: number
    color?: string
    maxValue?: number
    indeterminate?: boolean
    indeterminateDuration?: number
    textSize?: number
    textColor?: string
    textEnabled?: boolean
    children?: ReactNode
}

/**
 * Circular progress component with animation and nested children
 *
 * @param currentValue - Filled circle current value
 * @param radius - Circle radius
 * @param strokeWidth - Circle stroke width
 * @param duration - Circle progress animation duration
 * @param color - Color of circle progress
 * @param maxValue - Progress max value
 * @param indeterminate - Infinite spinning animation when there is no currentValue
 * @param indeterminateDuration - Duration of spin animation for 1 cycle
 * @param textSize - Circle text size to show percentage
 * @param textColor - Circle text color
 * @param textEnabled - Enable or disable text appearance
 * @param children - React Node
 * @constructor
 */
export const CircularProgress = ({
                                     currentValue = 80,
                                     radius = 20,
                                     strokeWidth = 4,
                                     duration = 500,
                                     color = Colors.primary,
                                     maxValue = 100,
                                     indeterminate = false,
                                     indeterminateDuration = 3000,
                                     textSize = 14,
                                     textColor = Colors.primary,
                                     textEnabled = true,
                                     children
                                 }: CircularProgressProps) => {
    const halfCircle = radius + strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const maxPercentage = (100 * currentValue) / maxValue;
    const strokeDashoffset = circumference - (circumference * maxPercentage) / 100;
    const animatedValue = useRef(new Animated.Value(circumference)).current;
    const animatedSpinValue = useRef(new Animated.Value(0)).current

    const spin = animatedSpinValue.interpolate({
        inputRange: [ 0, 1 ],
        outputRange: [ '0deg', '360deg' ]
    })

    useEffect(() => {
        const indeterminateDelta = 30 * Math.PI;
        const finalValue = indeterminateDelta - (indeterminateDelta * 80) / 100;

        let loopAnimation = Animated.loop(
            Animated.parallel([
                Animated.timing(animatedSpinValue, {
                    toValue: 1,
                    duration: indeterminateDuration,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),

                Animated.timing(animatedValue, {
                    toValue: finalValue * 30,
                    duration: indeterminateDuration,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                })
            ])
        )

        if (indeterminate) {
            loopAnimation?.start()
        }

        return () => {
            loopAnimation?.stop()
            loopAnimation = null;
        }
    }, [ indeterminate ])

    useEffect(() => {
        let progressAnim = Animated.timing(animatedValue, {
            toValue: strokeDashoffset,
            duration,
            useNativeDriver: false,
            easing: Easing.out(Easing.ease),
        });

        if (!indeterminate) {
            progressAnim?.start()
        }

        return () => {
            progressAnim?.stop()
            progressAnim = null
        }
    }, [ currentValue, indeterminate ]);

    const transform = indeterminate ? { transform: [ { rotate: spin } ] } : {}

    return (
        <View>
            <Animated.View style={ { width: radius * 2, height: radius * 2, ...transform } }>
                <Svg
                    width={ radius * 2 }
                    height={ radius * 2 }
                    viewBox={ `0 0 ${ halfCircle * 2 } ${ halfCircle * 2 }` }>
                    <G rotation="-90"
                       origin={ `${ halfCircle }, ${ halfCircle }` }>
                        <Circle
                            cx="50%"
                            cy="50%"
                            stroke={ color }
                            strokeWidth={ strokeWidth }
                            r={ radius }
                            fill="transparent"
                            strokeOpacity={ 0.2 }
                        />
                        <AnimatedCircle
                            cx="50%"
                            cy="50%"
                            stroke={ color }
                            strokeWidth={ strokeWidth }
                            r={ radius }
                            fill="transparent"
                            strokeDasharray={ circumference }
                            strokeDashoffset={ animatedValue }
                            strokeLinecap="round"
                        />
                    </G>
                </Svg>
            </Animated.View>
            { !indeterminate && textEnabled && !children && <AnimatedText style={ {
                ...StyleSheet.absoluteFillObject,
                fontSize: textSize,
                color: textColor,
                textAlign: "center",
                textAlignVertical: "center"
            } }>
                { `${ currentValue }` }
            </AnimatedText>  }
            { children && <View style={ {
                ...StyleSheet.absoluteFillObject,
                alignItems: "center",
                justifyContent: "center"
            } }>
                { children }
            </View> }
        </View>
    );
}