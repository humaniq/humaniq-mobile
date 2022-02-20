import React, { ReactNode, useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, View, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "react-native-ui-lib";

export enum SkeletonTemplate {
    LIST = 'list',
    CONTENT = 'content',
}

export interface SkeletonProps {
    /**
     * The width of the skeleton view.
     */
    width: number;
    /**
     * The height of the skeleton view.
     */
    height: number;
    /**
     * Whether skeleton view is loading.
     */
    isLoading: boolean;
    /**
     * The duration of shim animation.
     */
    shimDuration: number;
    /**
     * Whether the shim animation is enabled.
     */
    shimEnabled: boolean;
    /**
     * The delay of shim animation after first iteration.
     */
    delay: number;
    /**
     * List of the gradient colors of the Skeleton view.
     * The first item of the array i.e. color will be applied as background color for skeleton view
     */
    colors: string[];
    /**
     * Skeleton container style.
     */
    wrapperStyle?: StyleProp<ViewStyle>;
    /**
     * Skeleton children style.
     */
    contentStyle?: StyleProp<ViewStyle>;
    /**
     * Skeleton shimmer style. Condition style, appears when isLoading = true
     */
    shimmerStyle?: StyleProp<ViewStyle>;
    /**
     * React children.
     */
    children?: ReactNode;
}

export interface SkeletonViewProps {
    /**
     * The type of the skeleton view.
     * Types: LIST and CONTENT
     */
    type?: SkeletonTemplate;
    /**
     * Skeleton view props based on type.
     * Types: LIST and CONTENT
     */
    skeletonProps?: SkeletonListStyle | SkeletonContentStyle;
    /**
     * Skeleton container style.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * Whether skeleton view is loading.
     */
    isLoading?: boolean;
    /**
     * React children.
     */
    children?: ReactNode;
}

export interface SkeletonStyle {
    /**
     * List of the gradient colors of the Skeleton view.
     */
    colors?: string[];
    /**
     * The delay of shim animation after first iteration.
     */
    delay?: number;
    /**
     * The duration of shim animation.
     */
    shimDuration?: number;
    /**
     * The duration of shim animation.
     */
    shimEnabled?: boolean;
}

export interface SkeletonListStyle extends SkeletonStyle {
    /**
     * Whether avatar is enabled.
     */
    isAvatar?: boolean;
    /**
     * Size of the avatar if enabled.
     */
    avatarSize?: number;
    /**
     * Content row margins.
     */
    rowMargin?: number;
    /**
     * Width of the content row.
     */
    rowWidth?: number;
    /**
     * Height of the content row.
     */
    rowHeight?: number;
    /**
     * Number of content rows.
     */
    rowCount?: number;
    /**
     * Border radius of the content row.
     */
    rowBorderRadius?: number;
    /**
     * Size of the list.
     */
    itemsCount?: number;
    /**
     * Hide or show the list item divider.
     */
    isDivider?: boolean;
    /**
     * List item avatar radius, if enabled.
     * By default avatar is circle.
     */
    avatarRadius?: number;
}

export type SkeletonContentStyle = Omit<SkeletonListStyle, "isAvatar" | "avatarSize" | "itemsCount" | "avatarRadius" | "isDivider">

/**
 * Skeleton view with shimming animation.
 *
 * @param width
 * @param height
 * @param isLoading
 * @param wrapperStyle
 * @param contentStyle
 * @param shimmerStyle
 * @param shimDuration
 * @param shimEnabled
 * @param delay
 * @param colors
 * @param children
 * @constructor
 */
export const Skeleton = ({
                      width,
                      height,
                      isLoading,
                      shimDuration,
                      shimEnabled,
                      delay,
                      colors,
                      wrapperStyle = {},
                      contentStyle = {},
                      shimmerStyle = {},
                      children,
                  }: SkeletonProps) => {
    const shimAnimation = useRef(new Animated.Value(-1)).current

    useEffect(() => {
        let animatedValue

        if (shimEnabled) {
            animatedValue = Animated.loop(
                Animated.sequence([
                    Animated.timing(shimAnimation, {
                        toValue: 1,
                        duration: shimDuration,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                    Animated.delay(delay),
                ])
            )

            animatedValue?.start();
        }

        return () => {
            if (shimEnabled) {
                animatedValue?.stop()
                animatedValue = null
            }
        }
    }, [])

    return (
        <View style={ [
            isLoading && { height, width },
            { overflow: 'hidden' },
            isLoading && shimmerStyle,
            wrapperStyle,
        ] }>
            <View style={ [
                isLoading && { width: 0, height: 0, opacity: 0 },
                !isLoading && contentStyle,
            ] }>{ children }</View>
            { isLoading && (
                <View style={ { flex: 1, backgroundColor: colors[0], overflow: 'hidden' } }>
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
            ) }
        </View>
    );
};

/**
 * Skeleton container
 *
 * @param type
 * @param isLoading
 * @param children
 * @param skeletonProps
 * @param containerStyle
 * @constructor
 */
export const SkeletonView = ({
                                 type = SkeletonTemplate.CONTENT,
                                 children,
                                 isLoading,
                                 skeletonProps = {} as any,
                                 containerStyle = {}
                             }: SkeletonViewProps) => {
    let style;

    if (type === SkeletonTemplate.LIST) {
        style = { ...getDefaultSkeletonStyle(type) as SkeletonListStyle, ...skeletonProps }

        return <>
            { [ ...Array(style.itemsCount).keys() ].map((item, index) => {
                return <View key={ `skeleton_list_item_${ index }` }
                             style={ [ { flexDirection: 'row' }, containerStyle ] }>
                    { style.isAvatar && <Skeleton
                        width={ style.avatarSize }
                        height={ style.avatarSize }
                        isLoading={ isLoading }
                        shimDuration={ style.shimDuration }
                        shimEnabled={ style.shimEnabled }
                        wrapperStyle={ {
                            marginRight: 10,
                            borderRadius: typeof style.avatarRadius === 'number' ? style.avatarRadius : style.avatarSize / 2
                        } }
                        delay={ style.delay }
                        colors={ style.colors }/> }
                    <View style={ [ { flex: 1, justifyContent: "center" }, style.isDivider && dividerDefaultStyles ] }>
                        { [ ...Array(style.rowCount).keys() ].map((item, index) => {
                            return <View key={ `skeleton_content_row_item_${ index }` }
                                         style={ { overflow: 'hidden' } }>
                                <Skeleton
                                    width={ index % 2 === 0 ? style.rowWidth : style.rowWidth / 1.5 }
                                    height={ style.rowHeight }
                                    isLoading={ isLoading }
                                    colors={ style.colors }
                                    delay={ style.delay }
                                    shimDuration={ style.shimDuration }
                                    shimEnabled={ style.shimEnabled }
                                    wrapperStyle={ {
                                        marginTop: index === 0 ? 0 : style.rowMargin,
                                        borderRadius: style.rowBorderRadius
                                    } }/></View>
                        }) }
                    </View>
                </View>
            }) }
        </>
    } else {
        style = { ...getDefaultSkeletonStyle(type) as SkeletonContentStyle, ...skeletonProps }

        return <Skeleton width={ style.rowWidth }
                         height={ style.rowHeight }
                         isLoading={ isLoading }
                         colors={ style.colors }
                         delay={ style.delay }
                         shimEnabled={ style.shimEnabled }
                         shimDuration={ style.shimDuration }>{ children }</Skeleton>
    }
}

/**
 * Default values of the skeleton view styles
 * Based on skeleton types: LIST and CONTENT
 *
 * @param type
 */
const getDefaultSkeletonStyle = (type: SkeletonTemplate) => {
    if (type === SkeletonTemplate.LIST) {
        return {
            colors: [ "#ebebeb", "#c5c5c5", "#ebebeb" ],
            delay: 1000,
            shimDuration: 700,
            shimEnabled: true,
            isAvatar: true,
            isDivider: true,
            rowCount: 2,
            rowMargin: 10,
            rowWidth: 200,
            rowHeight: 8,
            rowBorderRadius: 4,
            itemsCount: 10,
            avatarSize: 60
        } as SkeletonListStyle
    } else {
        return {
            colors: [ "#ebebeb", "#c5c5c5", "#ebebeb" ],
            delay: 1000,
            shimDuration: 700,
            shimEnabled: true,
            rowCount: 3,
            rowMargin: 10,
            rowWidth: 200,
            rowHeight: 8,
            rowBorderRadius: 4,
        } as SkeletonContentStyle
    }
}

/**
 * Default style of the list item divider
 */
const dividerDefaultStyles = {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    paddingBottom: 2,
}