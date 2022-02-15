import React from "react"
import { Colors, View } from "react-native-ui-lib";

export enum QRBoundaryPosition {
    TOP_LEFT = 0,
    TOP_RIGHT = 1,
    BOTTOM_LEFT = 2,
    BOTTOM_RIGHT = 3,
}

export interface QRBoundaryCornerProps {
    position?: QRBoundaryPosition;
    size?: number;
    borderRadius?: number;
    width?: number;
    offset?: number;
    color?: string;
}

/**
 * A corner for QRScannerBoundary
 *
 * @param position
 * @param size
 * @param borderRadius
 * @param width
 * @param offset
 * @param color
 * @constructor
 */
export const QRBoundaryCorner = ({
                                     position = QRBoundaryPosition.TOP_LEFT,
                                     size = 32,
                                     borderRadius = 12,
                                     width = 5,
                                     offset = 0,
                                     color = Colors.white
                                 }: QRBoundaryCornerProps) => {
    return <View width={ size } height={ size } style={ {
        position: 'absolute',
        borderColor: color,
        ...getCornerProps(position, borderRadius, width, offset)
    } }/>
}

const getCornerProps = (position, borderRadius, width, offset) => {
    if (position === QRBoundaryPosition.TOP_RIGHT) {
        return {
            top: offset,
            right: offset,
            borderTopRightRadius: borderRadius,
            borderRightWidth: width,
            borderTopWidth: width,
            zIndex: 2
        }
    }
    if (position === QRBoundaryPosition.BOTTOM_LEFT) {
        return {
            bottom: offset,
            left: offset,
            borderBottomLeftRadius: borderRadius,
            borderLeftWidth: width,
            borderBottomWidth: width,
            zIndex: 2
        }
    }
    if (position === QRBoundaryPosition.BOTTOM_RIGHT) {
        return {
            bottom: offset,
            right: offset,
            borderBottomRightRadius: borderRadius,
            borderRightWidth: width,
            borderBottomWidth: width,
            zIndex: 2
        }
    }
    return {
        top: offset,
        left: offset,
        borderTopLeftRadius: borderRadius,
        borderLeftWidth: width,
        borderTopWidth: width,
        zIndex: 2
    }
}