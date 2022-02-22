import React, { useEffect, useRef } from "react"
import { Animated, Easing, StyleProp, View, ViewStyle } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { Colors } from "react-native-ui-lib"

const DELAY_DURATION = 1000
const SHIM_DURATION = 500
const SKELETON_COLORS = [ Colors.rgba("#e0e0e0", 0.4), Colors.rgba("#c5c5c5", 0.5), "#ebebeb" ]

export enum SkeletonTemplateTypes {
    TRANSACTION_LIST = 'transaction_list',
    WALLET_BUTTONS = 'wallet_buttons',
    AVATAR = 'avatar',
    ROW = 'row'
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
     */
    colors: string[];
    /**
     * The background color of the Skeleton view.
     * If not defined, the first item of the array i.e. colors, will be applied as background color for skeleton view
     */
    backgroundColor?: string;
    /**
     * Skeleton container style.
     */
    wrapperStyle?: StyleProp<ViewStyle>;
}

export interface SkeletonViewProps {
    /**
     * The type of the skeleton view.
     * Types: TRANSACTION_LIST, WALLET_BUTTONS, AVATAR and ROW
     */
    type?: SkeletonTemplateTypes;
    /**
     * Skeleton view props based on type.
     * Types: TRANSACTION_LIST, WALLET_BUTTONS, AVATAR and ROW
     */
    skeletonProps?: SkeletonListStyle | SkeletonWalletButtonsStyle | SkeletonAvatarStyle | SkeletonRowStyle;
    /**
     * Skeleton view container style.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * Skeleton view content style.
     */
    contentStyle?: StyleProp<ViewStyle>;
    /**
     * Whether skeleton view is loading.
     */
    isLoading?: boolean;
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
     * Divider color if enabled
     */
    dividerColor?: string;
    /**
     * List item avatar radius, if enabled.
     * By default avatar is circle.
     */
    avatarRadius?: number;
}

export interface SkeletonWalletButtonsStyle extends SkeletonStyle {
    /**
     * Width of the button.
     */
    buttonWidth?: number,
    /**
     * Height of the button.
     */
    buttonHeight?: number,
    /**
     * Button border radius.
     */
    borderRadius?: number,
}

export interface SkeletonAvatarStyle extends SkeletonStyle {
    /**
     * Size of the avatar if enabled.
     */
    avatarSize?: number;
    /**
     * Avatar border radius.
     */
    borderRadius?: number;
}

export interface SkeletonRowStyle extends SkeletonStyle {
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
     * Border radius of the content row.
     */
    rowBorderRadius?: number;
}

/**
 * Skeleton view with shimming animation.
 *
 * @param width
 * @param height
 * @param isLoading
 * @param wrapperStyle
 * @param shimDuration
 * @param shimEnabled
 * @param delay
 * @param colors
 * @param backgroundColor
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
                             backgroundColor
                         }: SkeletonProps) => {
    const bgColor = backgroundColor || colors[0]
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
            wrapperStyle,
        ] }>
            { isLoading && (
                <View style={ { flex: 1, backgroundColor: bgColor, overflow: 'hidden' } }>
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
 * @param skeletonProps
 * @param containerStyle
 * @param contentStyle
 * @constructor
 */
export const SkeletonView = ({
                                 type = SkeletonTemplateTypes.TRANSACTION_LIST,
                                 isLoading = true,
                                 skeletonProps = {} as any,
                                 containerStyle = {},
                                 contentStyle = {}
                             }: SkeletonViewProps) => {
    let style;

    if (type === SkeletonTemplateTypes.TRANSACTION_LIST) {
        style = { ...getDefaultSkeletonStyle(type) as SkeletonListStyle, ...skeletonProps }

        return <View
            style={ [ { backgroundColor: Colors.white, marginHorizontal: 16, borderRadius: 16 }, containerStyle ] }>
            { [ ...Array(style.itemsCount).keys() ].map((item, index) => {
                return <View key={ `skeleton_list_item_${ index }` }>
                    <View style={ [ { flexDirection: 'row' }, {
                        marginHorizontal: 12,
                        marginVertical: 16,
                    }, contentStyle ] }>
                        { style.isAvatar && <View style={ { alignItems: "center", justifyContent: "center" } }>
                            <Skeleton
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
                                colors={ style.colors }/></View> }
                        <View style={ {
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                        } }>
                            <View style={ { justifyContent: "center" } }>
                                { [ ...Array(style.rowCount).keys() ].map((item, index) => {
                                    return <View key={ `skeleton_content_row_item_${ index }` }
                                                 style={ { flexDirection: "row", alignItems: "center" } }>
                                        <View style={ { overflow: 'hidden' } }>
                                            <Skeleton
                                                width={ index % 2 === 0 ? style.rowWidth : style.rowWidth / 2 }
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
                                    </View>
                                }) }
                            </View>

                            <View style={ { alignItems: "center" } }>
                                <View style={ { overflow: 'hidden', alignSelf: "flex-end" } }>
                                    <Skeleton
                                        width={ 64 }
                                        height={ style.rowHeight }
                                        isLoading={ isLoading }
                                        colors={ style.colors }
                                        delay={ style.delay }
                                        shimDuration={ style.shimDuration }
                                        shimEnabled={ style.shimEnabled }
                                        wrapperStyle={ {
                                            borderRadius: style.rowBorderRadius
                                        } }/></View>
                                <View style={ { overflow: 'hidden', alignSelf: "flex-end" } }>
                                    <Skeleton
                                        width={ 36 }
                                        height={ style.rowHeight }
                                        isLoading={ isLoading }
                                        colors={ style.colors }
                                        delay={ style.delay }
                                        shimDuration={ style.shimDuration }
                                        shimEnabled={ style.shimEnabled }
                                        wrapperStyle={ {
                                            marginTop: style.rowMargin,
                                            borderRadius: style.rowBorderRadius
                                        } }/></View>
                            </View>
                        </View>
                    </View>
                    { style.isDivider && index !== style.itemsCount - 1 && <View style={ {
                        height: 1,
                        backgroundColor: style.dividerColor,
                    } }/> }
                </View>
            }) }
        </View>
    } else if (type === SkeletonTemplateTypes.AVATAR) {
        style = { ...getDefaultSkeletonStyle(type) as SkeletonAvatarStyle, ...skeletonProps }

        return <Skeleton
            width={ style.avatarSize }
            height={ style.avatarSize }
            isLoading={ isLoading }
            shimDuration={ style.shimDuration }
            shimEnabled={ style.shimEnabled }
            wrapperStyle={ [ {
                borderRadius: style.borderRadius ?? style.avatarSize / 2,
                marginHorizontal: 16,
            }, containerStyle
            ] }
            delay={ style.delay }
            colors={ style.colors }/>
    } else if (type === SkeletonTemplateTypes.WALLET_BUTTONS) {
        style = { ...getDefaultSkeletonStyle(type) as SkeletonWalletButtonsStyle, ...skeletonProps }

        return <View style={ [ {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        }, containerStyle ] }>
            <Skeleton
                width={ style.buttonWidth }
                height={ style.buttonHeight }
                isLoading={ isLoading }
                shimDuration={ style.shimDuration }
                shimEnabled={ style.shimEnabled }
                wrapperStyle={ {
                    flex: 0.5,
                    borderRadius: style.borderRadius,
                    marginRight: 8
                } }
                delay={ style.delay }
                colors={ style.colors }/>
            <Skeleton
                width={ style.buttonWidth }
                height={ style.buttonHeight }
                isLoading={ isLoading }
                shimDuration={ style.shimDuration }
                shimEnabled={ style.shimEnabled }
                wrapperStyle={ {
                    flex: 0.5,
                    borderRadius: style.borderRadius,
                    marginLeft: 8
                } }
                delay={ style.delay }
                colors={ style.colors }/>
        </View>
    } else {
        style = { ...getDefaultSkeletonStyle(type) as SkeletonRowStyle, ...skeletonProps }

        return <Skeleton
            width={ style.rowWidth }
            height={ style.rowHeight }
            isLoading={ isLoading }
            shimDuration={ style.shimDuration }
            shimEnabled={ style.shimEnabled }
            wrapperStyle={ [ { borderRadius: style.rowBorderRadius }, containerStyle ] }
            delay={ style.delay }
            colors={ style.colors }/>
    }
}

/**
 * Default values of the skeleton view styles
 * Based on skeleton types: TRANSACTION_LIST, WALLET_BUTTONS, AVATAR and ROW
 *
 * @param type
 */
const getDefaultSkeletonStyle = (type: SkeletonTemplateTypes) => {
    if (type === SkeletonTemplateTypes.TRANSACTION_LIST) {
        return {
            colors: SKELETON_COLORS,
            delay: DELAY_DURATION,
            shimDuration: SHIM_DURATION,
            shimEnabled: true,
            isAvatar: true,
            isDivider: true,
            rowCount: 2,
            rowMargin: 11,
            rowWidth: 138,
            rowHeight: 11,
            rowBorderRadius: 12,
            itemsCount: 3,
            avatarSize: 46,
            dividerColor: Colors.rgba("#e0e0e0", 0.4)
        } as SkeletonListStyle
    } else if (type === SkeletonTemplateTypes.AVATAR) {
        return {
            colors: SKELETON_COLORS,
            delay: DELAY_DURATION,
            shimDuration: SHIM_DURATION,
            shimEnabled: true,
            avatarSize: 80,
        } as SkeletonAvatarStyle
    } else if (type === SkeletonTemplateTypes.WALLET_BUTTONS) {
        return {
            colors: SKELETON_COLORS,
            delay: DELAY_DURATION,
            shimDuration: SHIM_DURATION,
            shimEnabled: true,
            buttonWidth: 200,
            buttonHeight: 42,
            borderRadius: 12
        } as SkeletonWalletButtonsStyle
    } else {
        return {
            colors: SKELETON_COLORS,
            delay: DELAY_DURATION,
            shimDuration: SHIM_DURATION,
            shimEnabled: true,
            rowWidth: 140,
            rowHeight: 16,
            rowBorderRadius: 0,
        } as SkeletonRowStyle
    }
}