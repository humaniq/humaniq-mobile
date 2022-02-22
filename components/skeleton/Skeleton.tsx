import React, { ReactNode, useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, View, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "react-native-ui-lib";
import { SCREEN_WIDTH } from "../../utils/screenUtils";

export enum SkeletonTemplateTypes {
    TRANSACTION_LIST = 'transaction_list',
    WALLET = 'wallet',
    ROW = 'row',
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
    /**
     * Skeleton children style.
     */
    childrenStyle?: StyleProp<ViewStyle>;
    /**
     * React children.
     */
    children?: ReactNode;
}

export interface SkeletonViewProps {
    /**
     * The type of the skeleton view.
     * Types: TRANSACTION_LIST, WALLET and ROW
     */
    type?: SkeletonTemplateTypes;
    /**
     * Skeleton view props based on type.
     * Types: TRANSACTION_LIST, WALLET and ROW
     */
    skeletonProps?: SkeletonListStyle | SkeletonWalletStyle | SkeletonRowStyle;
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

export interface SkeletonWalletStyle extends SkeletonStyle {
    /**
     * Button width.
     */
    buttonWidth?: number;
    /**
     * Button height.
     */
    buttonHeight?: number;
    /**
     * Button border radius.
     */
    buttonBorderRadius?: number;
    /**
     * Wallet title width.
     */
    titleWidth?: number;
    /**
     * Wallet title height.
     */
    titleHeight?: number;
    /**
     * Wallet subTitle width.
     */
    subTitleWidth?: number;
    /**
     * Wallet subTitle height.
     */
    subTitleHeight?: number;
    /**
     * Whether avatar is enabled.
     */
    isAvatar?: boolean;
    /**
     * Size of the avatar if enabled.
     */
    avatarSize?: number;
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
 * @param contentStyle
 * @param shimDuration
 * @param shimEnabled
 * @param delay
 * @param colors
 * @param backgroundColor
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
                             childrenStyle = {},
                             children,
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
            <View style={ [
                isLoading && { width: 0, height: 0, opacity: 0 },
                !isLoading && childrenStyle,
            ] }>{ children }</View>
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
 * @param children
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
                return <View key={ `skeleton_list_item_${ index }` }
                             style={ [ { flexDirection: 'row' }, {
                                 marginHorizontal: 16,
                                 marginVertical: 16
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
                    <View style={ [ { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
                        style.isDivider && dividerDefaultStyles
                    ] }>
                        <View style={ { justifyContent: "center" } }>
                            { [ ...Array(style.rowCount).keys() ].map((item, index) => {
                                return <View key={ `skeleton_content_row_item_${ index }` }
                                             style={ { flexDirection: "row", alignItems: "center" } }>
                                    <View style={ { overflow: 'hidden' } }>
                                        <Skeleton
                                            width={ index % 2 !== 0 ? style.rowWidth : style.rowWidth / 1.3 }
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
                                    width={ 60 }
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
                                    width={ 70 }
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
            }) }
        </View>
    } else if (type === SkeletonTemplateTypes.WALLET) {
        style = { ...getDefaultSkeletonStyle(type) as SkeletonWalletStyle, ...skeletonProps }

        return <View>
            <View style={ { alignItems: "center", justifyContent: "center", paddingTop: 10 } }>
                <Skeleton
                    width={ style.avatarSize }
                    height={ style.avatarSize }
                    isLoading={ isLoading }
                    shimDuration={ style.shimDuration }
                    shimEnabled={ style.shimEnabled }
                    delay={ style.delay }
                    colors={ style.colors }/>
            </View>

            <View style={ { alignItems: "center", justifyContent: "center" } }>
                <Skeleton
                    width={ style.titleWidth }
                    height={ style.titleHeight }
                    isLoading={ isLoading }
                    shimDuration={ style.shimDuration }
                    shimEnabled={ style.shimEnabled }
                    wrapperStyle={ {
                        marginTop: 8
                    } }
                    delay={ style.delay }
                    colors={ style.colors }/>

                <Skeleton
                    width={ style.subTitleWidth }
                    height={ style.subTitleHeight }
                    isLoading={ isLoading }
                    shimDuration={ style.shimDuration }
                    shimEnabled={ style.shimEnabled }
                    wrapperStyle={ {
                        marginTop: 6
                    } }
                    delay={ style.delay }
                    colors={ style.colors }/>
            </View>

            <View style={ {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginHorizontal: 16,
                marginTop: 20
            } }>
                <Skeleton
                    width={ style.buttonWidth }
                    height={ style.buttonHeight }
                    isLoading={ isLoading }
                    shimDuration={ style.shimDuration }
                    shimEnabled={ style.shimEnabled }
                    wrapperStyle={ {
                        flex: 1,
                        borderRadius: style.buttonBorderRadius,
                        marginRight: 8
                    } }
                    delay={ style.delay }
                    colors={ style.colors }/>
            </View>
        </View>
    } else {
        style = { ...getDefaultSkeletonStyle(type) as SkeletonRowStyle, ...skeletonProps }

        return <View style={ { marginHorizontal: 16, marginTop: 16, marginBottom: 6 } }>
            <Skeleton
                width={ style.rowWidth }
                height={ style.rowHeight }
                isLoading={ isLoading }
                shimDuration={ style.shimDuration }
                shimEnabled={ style.shimEnabled }
                wrapperStyle={ {
                    marginTop: 8
                } }
                delay={ style.delay }
                colors={ style.colors }/>
        </View>
    }
}

/**
 * Default values of the skeleton view styles
 * Based on skeleton types: TRANSACTION_LIST, WALLET and ROW
 *
 * @param type
 */
const getDefaultSkeletonStyle = (type: SkeletonTemplateTypes) => {
    if (type === SkeletonTemplateTypes.TRANSACTION_LIST) {
        return {
            colors: [ "#ebebeb", "#c5c5c5", "#ebebeb" ],
            delay: 800,
            shimDuration: 400,
            shimEnabled: true,
            isAvatar: true,
            isDivider: false,
            rowCount: 2,
            rowMargin: 14,
            rowWidth: 150,
            rowHeight: 14,
            rowBorderRadius: 0,
            itemsCount: 10,
            avatarSize: 40
        } as SkeletonListStyle
    } else if (type === SkeletonTemplateTypes.WALLET) {
        return {
            colors: [ "#ebebeb", "#c5c5c5", "#ebebeb" ],
            delay: 800,
            shimDuration: 400,
            shimEnabled: true,
            isAvatar: true,
            avatarSize: 80,
            titleWidth: 80,
            titleHeight: 16,
            subTitleWidth: 150,
            subTitleHeight: 14,
            buttonWidth: SCREEN_WIDTH,
            buttonHeight: 40,
            buttonBorderRadius: 0,
        } as SkeletonWalletStyle
    } else {
        return {
            colors: [ "#ebebeb", "#c5c5c5", "#ebebeb" ],
            delay: 800,
            shimDuration: 400,
            shimEnabled: true,
            rowWidth: 140,
            rowHeight: 16,
            rowBorderRadius: 0,
        } as SkeletonRowStyle
    }
}

/**
 * Default style of the list item divider
 */
const dividerDefaultStyles = {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    paddingBottom: 6,
}