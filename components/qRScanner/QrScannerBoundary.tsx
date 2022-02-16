import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Button, Colors, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { QRBoundaryCorner, QRBoundaryPosition } from "./QRBoundaryCorner";
import { isEmpty } from "../../utils/general";
import { HIcon } from "../icon";

export interface QrScannerBoundaryProps {
    maskColor?: string;
    squareSize?: number;
    drawCorners?: boolean;
    drawScan?: boolean;
    scanColor?: string;
    helperText?: string;
    helperTextColor?: string;
    cornersColor?: string;
    borderWidth?: number;
    scanHeight?: number;
    bottomButtonTitle?: string;
    bottomButtonOnClick?: () => void;
    closeButtonOnClick?: () => void;
}

const SCAN_ANIMATION_DURATION = 4000
const FADE_ANIMATION_DURATION = 400

/**
 * QR Scanner boundary view represented as a square in the middle of camera
 *
 * @param maskColor
 * @param squareSize
 * @param drawCorners
 * @param drawScan
 * @param scanColor
 * @param helperText
 * @param cornersColor
 * @param borderWidth
 * @param scanHeight
 * @param helperTextColor
 * @param closeButtonOnClick
 * @param bottomButtonTitle
 * @param bottomButtonOnClick
 * @constructor
 */
export const QrScannerBoundary = ({
                                      maskColor = Colors.rgba("#000000", 0.5),
                                      squareSize = 280,
                                      drawCorners = true,
                                      drawScan = false,
                                      scanColor = Colors.primary,
                                      helperText,
                                      cornersColor = Colors.white,
                                      borderWidth = 4,
                                      scanHeight = 1.5,
                                      helperTextColor = Colors.white,
                                      bottomButtonTitle,
                                      bottomButtonOnClick,
                                      closeButtonOnClick,
                                  }: QrScannerBoundaryProps) => {
    const scanStartValue = drawCorners ? borderWidth : 0

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
                            toValue: scanStartValue,
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

    return <View flex>
        <View flex backgroundColor={ maskColor }/>
        <View row>
            <View flex backgroundColor={ maskColor }/>
            <View height={ squareSize } width={ squareSize }>
                { drawScan && <Animated.View style={ {
                    transform: [ { translateY: animatedScan } ],
                    opacity: animatedFade,
                    height: scanHeight,
                    width: squareSize - 2 * scanStartValue,
                    marginHorizontal: scanStartValue,
                    backgroundColor: scanColor
                } }/> }
                { drawCorners && <>
                    <QRBoundaryCorner width={ borderWidth } color={ cornersColor }
                                      position={ QRBoundaryPosition.TOP_LEFT }/>
                    <QRBoundaryCorner width={ borderWidth } color={ cornersColor }
                                      position={ QRBoundaryPosition.TOP_RIGHT }/>
                    <QRBoundaryCorner width={ borderWidth } color={ cornersColor }
                                      position={ QRBoundaryPosition.BOTTOM_LEFT }/>
                    <QRBoundaryCorner width={ borderWidth } color={ cornersColor }
                                      position={ QRBoundaryPosition.BOTTOM_RIGHT }/>
                </> }
            </View>
            <View flex backgroundColor={ maskColor }/>
        </View>
        { !isEmpty(helperText) ? <View paddingH-70 center backgroundColor={ maskColor } style={ { flex: 0.5 } }>
            <Text RobotoM style={ {
                color: helperTextColor,
                fontSize: 19,
                justifyContent: 'center',
                textAlign: 'center'
            } }>{ helperText }</Text>
        </View> : null }
        <View flex backgroundColor={ maskColor }/>
        { !isEmpty(bottomButtonTitle) && <Button robotoM outline outlineColor={ Colors.white } style={ {
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 20,
            borderRadius: 10
        } } onPress={ bottomButtonOnClick } label={ bottomButtonTitle }/> }
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