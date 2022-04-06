import * as Sentry from "@sentry/react-native";
import { Transaction } from "@sentry/types";
import { EVENTS } from "../../config/events";

class Profiler {

    transactions: Map<string, Transaction> = new Map<string, Transaction>()

    start = (event: EVENTS, tags?: any): string => {
        const transaction = Sentry.startTransaction({
            op: event,
            name: event,
            tags,
            trimEnd: true
        })
        this.transactions.set(transaction.traceId, transaction)
        return transaction.traceId
    }

    end = (traceId: string): Transaction => {
        const selectedTransaction = this.transactions.get(traceId)
        selectedTransaction?.finish()
        this.transactions.delete(traceId)
        return selectedTransaction
    }
}

export const profiler = new Profiler()

