import React, { ReactNode, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MaskedView from "@react-native-community/masked-view"
import Animated, {
    useSharedValue,
    withRepeat,
    withTiming,
    useAnimatedStyle,
    interpolate, withDelay,
} from 'react-native-reanimated';
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "react-native-ui-lib";

const SHIM_DURATION = 1200
const SHIM_DELAY = 0
const DEFAULT_SKELETON_COLOR = Colors.grey

export interface SkeletonLoaderProps {
    /**
     * The duration of shim animation.
     */
    shimDuration?: number;
    /**
     * Whether the shim animation is enabled.
     */
    shimEnabled?: boolean;
    /**
     * The delay of shim animation after first iteration.
     */
    delay?: number;
    /**
     * The background color of the Skeleton view.
     */
    backgroundColor?: string;
    /**
     * The background color of the Skeleton view.
     */
    highlightColor?: string;
    /**
     *  Skeleton children.
     */
    children?: ReactNode;
}

/**
 * Skeleton wrapper above skeleton children.
 *
 * @param shimDuration
 * @param shimEnabled
 * @param delay
 * @param backgroundColor
 * @param highlightColor
 * @param children
 * @constructor
 */
export const SkeletonSuit = ({
                                 shimDuration = SHIM_DURATION,
                                 shimEnabled = true,
                                 delay = SHIM_DELAY,
                                 backgroundColor = DEFAULT_SKELETON_COLOR,
                                 highlightColor = Colors.white,
                                 children,
                             }: SkeletonLoaderProps) => {
    const [ view, setView ] = useState({ width: 0, height: 0 });
    const shimAnimation = useSharedValue(0);

    useEffect(() => {
        if (shimEnabled) {
            shimAnimation.value = withDelay(
                delay,
                withRepeat(
                    withTiming(1, {
                        duration: shimDuration
                    }), -1)
            );
        }
    }, []);

    const shimAnimatedStyles = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: interpolate(
                    shimAnimation.value, [ 0, 1 ], [ -view.width, view.width ],
                ),
            },
        ],
    }));

    if (!view.width && !view.height) {
        return (
            <View onLayout={ event => setView(event.nativeEvent.layout) }>
                { children }
            </View>
        );
    }

    return (
        <MaskedView
            style={ { height: view.height, width: view.width } }
            maskElement={ <View>{ children }</View> }>
            <View
                style={ {
                    backgroundColor,
                    flexGrow: 1,
                    overflow: 'hidden',
                } }
            />
            <Animated.View style={ [ shimAnimatedStyles, StyleSheet.absoluteFill ] }>
                <MaskedView
                    style={ StyleSheet.absoluteFill }
                    maskElement={
                        <LinearGradient
                            start={ { x: 0, y: 0 } }
                            end={ { x: 1, y: 0 } }
                            style={ StyleSheet.absoluteFill }
                            colors={ [ "transparent", "black", "transparent" ] }
                        />
                    }>
                    <View
                        style={ [
                            StyleSheet.absoluteFill,
                            { backgroundColor: highlightColor },
                        ] }
                    />
                </MaskedView>
            </Animated.View>
        </MaskedView>
    );
};

/**
 * SkeletonRaw
 *
 * @param style
 * @param backgroundColor
 * @constructor
 */
export const SkeletonRaw = ({ style, backgroundColor = DEFAULT_SKELETON_COLOR }) => {
    return <View style={ [ style, { backgroundColor } ] }/>;
};
