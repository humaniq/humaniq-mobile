import React, { useEffect, useRef } from 'react'
import { Button, Colors, Text, TouchableOpacity, View } from "react-native-ui-lib";
import Svg, { Defs, Mask, Rect } from "react-native-svg";
import { Animated, Dimensions, Easing } from "react-native";
import { HIcon } from "../icon";
import { isEmpty } from "../../utils/general";

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

export interface QrScannerRoundedBoundaryProps {
    maskColor?: string;
    maskOpacity?: number;
    borderRadius?: number;
    squareSize?: number;
    helperText?: string;
    helperTextColor?: string;
    bottomButtonTitle?: string;
    drawScan?: boolean;
    bottomButtonOnClick?: () => void;
    closeButtonOnClick?: () => void;
    scanHeight?: number;
    scanColor?: string;
    borderWidth?: number;
    borderColor?: string;
    xOffset?: number;
    yOffset?: number;
}

const SCAN_ANIMATION_DURATION = 4000
const FADE_ANIMATION_DURATION = 400

/**
 * QR Scanner boundary view represented as a rounded square in the middle of camera
 *
 * @param maskColor
 * @param borderRadius
 * @param squareSize
 * @param closeButtonOnClick
 * @param bottomButtonOnClick
 * @param helperText
 * @param helperTextColor
 * @param bottomButtonTitle
 * @param drawScan
 * @param scanHeight
 * @param scanColor
 * @param borderWidth
 * @param borderColor
 * @param maskOpacity
 * @param xOffset
 * @param yOffset
 */
export const QrScannerRoundedBoundary = ({
                                             maskColor = "#000000",
                                             borderRadius = 24,
                                             squareSize = 280,
                                             closeButtonOnClick,
                                             bottomButtonOnClick,
                                             helperText,
                                             helperTextColor = Colors.white,
                                             bottomButtonTitle,
                                             drawScan = false,
                                             scanHeight = 1.5,
                                             scanColor = Colors.primary,
                                             borderWidth = 2,
                                             borderColor = Colors.white,
                                             maskOpacity = 0.6,
                                             xOffset = 2,
                                             yOffset = 3,
                                         }: QrScannerRoundedBoundaryProps) => {
    const scanStartValue = borderWidth > 0 ? 4 * borderWidth : 0

    const animatedScan = useRef(new Animated.Value(scanStartValue)).current
    const animatedFade = useRef(new Animated.Value(0.1)).current

    useEffect(() => {
        const endValue = squareSize - scanHeight - scanStartValue;
        let animation;

        if (drawScan) {
            animation = Animated.parallel([
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(animatedScan, {
                            toValue: endValue,
                            duration: SCAN_ANIMATION_DURATION,
                            easing: Easing.linear,
                            isInteraction: false,
                            useNativeDriver: true,
                        }),
                        Animated.timing(animatedScan, {
                            toValue: 0,
                            duration: SCAN_ANIMATION_DURATION,
                            easing: Easing.linear,
                            isInteraction: false,
                            useNativeDriver: true,
                        }),
                    ]),
                ),
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(animatedFade, {
                            toValue: 1,
                            duration: FADE_ANIMATION_DURATION,
                            easing: Easing.ease,
                            useNativeDriver: true
                        }),
                        Animated.timing(animatedFade, {
                            toValue: 0.1,
                            duration: FADE_ANIMATION_DURATION,
                            easing: Easing.ease,
                            useNativeDriver: true
                        })
                    ])
                )
            ])
        }

        if (drawScan) {
            animation?.start()
        }

        return () => {
            if (drawScan) {
                animation?.stop()
                animation = null
            }
        }
    }, [])

    return <View style={ {
        position: 'absolute',
        width: deviceWidth,
        height: deviceHeight,
    } }>
        <Svg height="100%" width="100%">
            <Defs>
                <Mask id="clip">
                    <Rect height="100%" width="100%" fill={ "white" } opacity={ maskOpacity }/>
                    <Rect
                        x={ (deviceWidth / xOffset) - (squareSize / xOffset) }
                        y={ (deviceHeight / yOffset) - (squareSize / yOffset) }
                        rx={ borderRadius }
                        ry={ borderRadius }
                        width={ squareSize }
                        height={ squareSize }
                        fill-opacity="0"
                        fill={ "black" }
                    />
                </Mask>
            </Defs>
            <Rect height="100%" width="100%" mask={ `url(#clip)` } fill={ maskColor }/>
        </Svg>
        <View style={ {
            position: 'absolute',
            top: (deviceHeight / yOffset) - (squareSize / yOffset),
            bottom: (deviceHeight / yOffset) - (squareSize / yOffset),
            left: (deviceWidth / xOffset) - (squareSize / xOffset),
            right: (deviceWidth / xOffset) - (squareSize / xOffset),
            borderColor,
            borderRadius,
            borderWidth,
            width: squareSize,
            height: squareSize,
        } }>
            { drawScan ? <Animated.View style={ {
                transform: [ { translateY: animatedScan } ],
                opacity: animatedFade,
                height: scanHeight,
                width: squareSize - 3 * scanStartValue,
                backgroundColor: scanColor,
                alignSelf: 'center'
            } }/> : null }
        </View>
        { !isEmpty(helperText) ? <View paddingH-70 center style={ {
            position: 'absolute',
            top: (deviceHeight / yOffset) - (squareSize / yOffset) + squareSize + 20 ,
            left: 0,
            right: 0
        } }>
            <Text RobotoM style={ {
                color: helperTextColor,
                fontSize: 19,
                justifyContent: 'center',
                textAlign: 'center'
            } }>{ helperText }</Text>
        </View> : null }
        { !isEmpty(bottomButtonTitle) ? <Button robotoM outline outlineColor={ Colors.white } style={ {
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 20,
            borderRadius: 10
        } } onPress={ bottomButtonOnClick } label={ bottomButtonTitle }/> : null }
        { typeof closeButtonOnClick === 'function' && <TouchableOpacity style={ {
            position: 'absolute',
            left: 20,
            top: 50,
            width: 40
        } } onPress={ closeButtonOnClick }>
            <HIcon name={ 'cross' } size={ 16 } color={ Colors.white }/>
        </TouchableOpacity> }
    </View>
}