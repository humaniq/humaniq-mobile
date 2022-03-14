import React from "react"
import { Skeleton } from "../Skeleton";
import { Colors, View } from "react-native-ui-lib";

export interface SkeletonScreenProps {
    backgroundColor?: string;
    count?: number
    marginH?: number
    marginV?: number
}

/**
 * Full screen skeleton template for Transaction List
 *
 * @param backgroundColor
 * @constructor
 */
export const TransactionListScreenSkeleton = ({
                                                  backgroundColor = Colors.bg,
                                              }: SkeletonScreenProps) => {
    return <View flex-1 backgroundColor={ backgroundColor }>
        <Skeleton width={ 76 } height={ 76 } borderRadius={ 38 } wrapperStyle={ {
            marginHorizontal: 16,
            marginTop: 10,
            alignSelf: "center"
        } }/>
        <View center>
            <Skeleton width={ 160 } height={ 23 } borderRadius={ 12 } wrapperStyle={ {
                marginTop: 13,
            } }/>
            <Skeleton width={ 96 } height={ 12 } borderRadius={ 12 } wrapperStyle={ {
                marginTop: 13,
            } }/>
        </View>
        <View row center marginT-26 marginH-16>
            <Skeleton width={ 200 } height={ 42 } borderRadius={ 12 } wrapperStyle={ {
                flex: 0.5,
                marginRight: 8,
            } }/>
            <Skeleton width={ 200 } height={ 42 } borderRadius={ 12 } wrapperStyle={ {
                flex: 0.5,
                marginLeft: 8,
            } }/>
        </View>
        <ListSkeleton marginV={ 20 }/>
    </View>
}

/**
 * Full screen skeleton template for Wallet List
 *
 * @param backgroundColor
 * @constructor
 */
export const WalletListScreenSkeleton = ({ backgroundColor = Colors.bg }: SkeletonScreenProps) => {
    return <View flex-1 backgroundColor={ backgroundColor }>
        <Skeleton width={ 170 } height={ 22 } borderRadius={ 12 } wrapperStyle={ {
            marginTop: 28,
            marginHorizontal: 16
        } }/>
        <View row marginT-30 marginH-16 style={ { justifyContent: "space-between" } }>
            <View>
                <Skeleton width={ 90 } height={ 22 } borderRadius={ 12 }/>
                <Skeleton width={ 136 } height={ 12 } borderRadius={ 12 } wrapperStyle={ { marginTop: 12 } }/>
            </View>
            <Skeleton width={ 120 } height={ 40 } borderRadius={ 12 }/>
        </View>
        <View row center marginT-34 marginH-16>
            <Skeleton width={ 200 } height={ 42 } borderRadius={ 12 } wrapperStyle={ {
                flex: 0.5,
                marginRight: 8,
            } }/>
            <Skeleton width={ 200 } height={ 42 } borderRadius={ 12 } wrapperStyle={ {
                flex: 0.5,
                marginLeft: 8,
            } }/>
        </View>
        <ListSkeleton marginV={ 20 }/>
    </View>
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
        <View marginH-16>
            { [ ...Array(count).keys() ].map((item, index) => {
                return <View key={ `skeleton_list_item_${ index }` }>
                    <View row marginV-16>
                        <View center>
                            <Skeleton width={ 46 } height={ 46 } borderRadius={ 23 } wrapperStyle={ {
                                marginRight: 10,
                            } }/>
                        </View>
                        <View flex-1 row style={ {
                            alignItems: "center",
                            justifyContent: "space-between"
                        } }>
                            <View centerV>
                                <Skeleton width={ 138 } height={ 11 } borderRadius={ 12 }/>
                                <Skeleton width={ 69 } height={ 11 } borderRadius={ 12 } wrapperStyle={ {
                                    marginTop: 11,
                                } }/>
                            </View>
                            <View centerV>
                                <Skeleton width={ 64 } height={ 11 } borderRadius={ 12 } wrapperStyle={ {
                                    alignSelf: "flex-end"
                                } }/>
                                <Skeleton width={ 34 } height={ 11 } borderRadius={ 12 } wrapperStyle={ {
                                    marginTop: 11,
                                    alignSelf: "flex-end"
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
    </View>
}