import React from "react"
import { SkeletonTemplateTypes, SkeletonView } from "../Skeleton";
import { Colors, View } from "react-native-ui-lib";

export interface SkeletonScreenProps {
    backgroundColor?: string;
    isLoading?: boolean;
}

/**
 * Full screen skeleton template for Transaction List
 *
 * @param backgroundColor
 * @param isLoading
 * @constructor
 */
export const TransactionListScreenSkeleton = ({
                                                  backgroundColor = Colors.bg,
                                                  isLoading = true
                                              }: SkeletonScreenProps) => {
    return <View flex-1 backgroundColor={ backgroundColor }>
        <View center paddingT-10>
            <SkeletonView isLoading={ isLoading } type={ SkeletonTemplateTypes.AVATAR }/>
        </View>

        <View center>
            <SkeletonView isLoading={ isLoading } type={ SkeletonTemplateTypes.ROW } skeletonProps={ {
                rowWidth: 160,
                rowHeight: 23,
                rowBorderRadius: 12
            } } containerStyle={ {
                marginTop: 13,
            } }/>
            <SkeletonView isLoading={ isLoading } type={ SkeletonTemplateTypes.ROW } skeletonProps={ {
                rowWidth: 96,
                rowHeight: 12,
                rowBorderRadius: 12
            } } containerStyle={ {
                marginTop: 13,
            } }/>
        </View>

        <SkeletonView isLoading={ isLoading } type={ SkeletonTemplateTypes.WALLET_BUTTONS } containerStyle={ {
            marginTop: 26,
            marginHorizontal: 16
        } }/>

        <SkeletonView type={ SkeletonTemplateTypes.TRANSACTION_LIST } containerStyle={ { marginTop: 22 } }/>
    </View>
}

/**
 * Full screen skeleton template for Wallet List
 *
 * @param backgroundColor
 * @param isLoading
 * @constructor
 */
export const WalletListScreenSkeleton = ({ backgroundColor = Colors.bg, isLoading = true }: SkeletonScreenProps) => {
    return <View flex-1 backgroundColor={ backgroundColor }>
        <SkeletonView isLoading={ isLoading } type={ SkeletonTemplateTypes.ROW } skeletonProps={ {
            rowWidth: 170,
            rowHeight: 22,
            rowBorderRadius: 12
        } } containerStyle={ {
            marginTop: 28,
            marginHorizontal: 16
        } }/>

        <View row marginT-30 marginH-16 style={ { justifyContent: "space-between" } }>
            <View>
                <SkeletonView isLoading={ isLoading } type={ SkeletonTemplateTypes.ROW } skeletonProps={ {
                    rowWidth: 90,
                    rowHeight: 22,
                    rowBorderRadius: 12
                } }/>
                <SkeletonView isLoading={ isLoading } type={ SkeletonTemplateTypes.ROW } skeletonProps={ {
                    rowWidth: 136,
                    rowHeight: 12,
                    rowBorderRadius: 12
                } } containerStyle={ {
                    marginTop: 12
                } }/>
            </View>

            <SkeletonView isLoading={ isLoading } type={ SkeletonTemplateTypes.ROW } skeletonProps={ {
                rowWidth: 120,
                rowHeight: 40,
                rowBorderRadius: 12
            } }/>
        </View>

        <SkeletonView isLoading={ isLoading } type={ SkeletonTemplateTypes.WALLET_BUTTONS } containerStyle={ {
            marginTop: 34,
            marginHorizontal: 16
        } }/>

        <SkeletonView isLoading={ isLoading } type={ SkeletonTemplateTypes.TRANSACTION_LIST }
                      containerStyle={ { marginTop: 24 } }/>
    </View>
}