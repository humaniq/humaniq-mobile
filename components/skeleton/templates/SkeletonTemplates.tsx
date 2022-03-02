import React from "react"
import { Colors, View } from "react-native-ui-lib";
import { SkeletonRaw, SkeletonSuit } from "../SkeletonSuit";

export interface SkeletonScreenProps {
    backgroundColor?: string
    count?: number
    marginH?: number
    marginV?: number
}

/**
 * List loader
 *
 * @param backgroundColor
 * @param marginH
 * @param marginV
 * @param count
 * @constructor
 */
export const ListSkeleton = ({
                                 backgroundColor = Colors.white,
                                 count = 3,
                                 marginH = 16,
                                 marginV = 16
                             }: SkeletonScreenProps) => {
    return <View style={ { backgroundColor, marginHorizontal: marginH, marginVertical: marginV, borderRadius: 12 } }>
        <SkeletonSuit>
            <View marginH-16>
                { [ ...Array(count).keys() ].map((item, index) => {
                    return <View key={ `skeleton_list_item_${ index }` }>
                        <View row marginV-16>
                            <View center>
                                <SkeletonRaw style={ {
                                    width: 46,
                                    height: 46,
                                    marginRight: 10,
                                    borderRadius: 23
                                } }/>
                            </View>
                            <View flex-1 row style={ {
                                alignItems: "center",
                                justifyContent: "space-between"
                            } }>
                                <View style={ { justifyContent: "center" } }>
                                    <SkeletonRaw style={ {
                                        width: 138,
                                        height: 11,
                                        borderRadius: 12
                                    } }/>
                                    <SkeletonRaw style={ {
                                        width: 138 / 2,
                                        height: 11,
                                        marginTop: 11,
                                        borderRadius: 12
                                    } }/>
                                </View>

                                <View style={ { alignItems: "center" } }>
                                    <SkeletonRaw style={ {
                                        width: 64,
                                        height: 11,
                                        borderRadius: 12,
                                        alignSelf: "flex-end"
                                    } }/>
                                    <SkeletonRaw style={ {
                                        width: 34,
                                        height: 11,
                                        borderRadius: 12,
                                        alignSelf: "flex-end",
                                        marginTop: 11,
                                    } }/>
                                </View>
                            </View>
                        </View>
                        { index !== count - 1 && <View style={ {
                            height: 1,
                            backgroundColor: Colors.rgba("#e0e0e0", 0.4),
                        } }/> }
                    </View>
                }) }
            </View>
        </SkeletonSuit>
    </View>
}

/**
 * WalletsScreen loader
 *
 * @param backgroundColor
 * @constructor
 */
export const WalletsScreenSkeleton = ({ backgroundColor = Colors.bg }: SkeletonScreenProps) => {
    return <View flex-1 backgroundColor={ backgroundColor }>
        <SkeletonSuit>
            <SkeletonRaw style={ {
                width: 170,
                height: 22,
                borderRadius: 12,
                marginTop: 28,
                marginHorizontal: 16
            } }/>
            <View row marginT-30 marginH-16 style={ { justifyContent: "space-between" } }>
                <View>
                    <SkeletonRaw style={ {
                        width: 90,
                        height: 22,
                        borderRadius: 12,
                    } }/>
                    <SkeletonRaw style={ {
                        width: 136,
                        height: 12,
                        borderRadius: 12,
                        marginTop: 12
                    } }/>
                </View>
                <SkeletonRaw style={ {
                    width: 120,
                    height: 40,
                    borderRadius: 12
                } }/>
            </View>
            <View row center marginT-34 marginH-16>
                <SkeletonRaw style={ {
                    flex: 0.5,
                    borderRadius: 12,
                    marginRight: 8,
                    height: 42,
                } }/>
                <SkeletonRaw style={ {
                    flex: 0.5,
                    borderRadius: 12,
                    marginLeft: 8,
                    height: 42,
                } }/>
            </View>
        </SkeletonSuit>
        <ListSkeleton/>
    </View>
}

/**
 * TransactionListScreen loader
 *
 * @param backgroundColor
 * @constructor
 */
export const TransactionListScreenSkeleton = ({
                                                  backgroundColor = Colors.bg,
                                              }: SkeletonScreenProps) => {
    return <View flex-1 backgroundColor={ backgroundColor }>
        <SkeletonSuit>
            <SkeletonRaw style={ {
                width: 76,
                height: 76,
                borderRadius: 38,
                marginHorizontal: 16,
                marginTop: 10,
                alignSelf: "center"
            } }/>
            <View center>
                <SkeletonRaw style={ {
                    width: 160,
                    height: 23,
                    borderRadius: 12,
                    marginTop: 13
                } }/>
                <SkeletonRaw style={ {
                    width: 96,
                    height: 12,
                    borderRadius: 12,
                    marginTop: 13
                } }/>
            </View>
            <View marginH-16 marginT-30 row center>
                <SkeletonRaw style={ {
                    flex: 0.5,
                    borderRadius: 12,
                    marginRight: 8,
                    height: 42,
                } }/>
                <SkeletonRaw style={ {
                    flex: 0.5,
                    borderRadius: 12,
                    marginLeft: 8,
                    height: 42,
                } }/>
            </View>
        </SkeletonSuit>
        <ListSkeleton marginV={ 20 }/>
    </View>
}
