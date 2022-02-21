import React from "react"
import { ScrollView } from "react-native"
import { SkeletonTemplateTypes, SkeletonView } from "../Skeleton";
import { Colors } from "react-native-ui-lib";

export interface TransactionListScreenSkeletonProps {
    backgroundColor?: string
}

/**
 * Full skeleton template for transaction list screen
 *
 * @param backgroundColor
 * @constructor
 */
export const TransactionListScreenSkeleton = ({ backgroundColor = Colors.white }: TransactionListScreenSkeletonProps) => {
    return <ScrollView style={ { backgroundColor } }>
        <SkeletonView type={ SkeletonTemplateTypes.WALLET }/>
        <SkeletonView type={ SkeletonTemplateTypes.ROW } containerStyle={ { marginTop: 40 } }/>
        <SkeletonView type={ SkeletonTemplateTypes.TRANSACTION_LIST }/>
    </ScrollView>
}