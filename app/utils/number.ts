import currency from "currency.js"

export function amountFormat(amount, number) {
  return currency(amount, { precision: number, symbol: "" }).format()
}
