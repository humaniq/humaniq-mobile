import { CurrencyCode } from "../../../../references/currency"


export type Rates = Record<CurrencyCode, number>;
export type MultiRates = Record<number, Rates>;
