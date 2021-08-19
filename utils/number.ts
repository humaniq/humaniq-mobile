import currency from "currency.js";

export function amountFormat(amount, number) {
  return currency(amount, { precision: number, symbol: "" }).format();
}

export function currencyFormat(amount, symbol?: string) {
  return symbol ? currency(amount, { symbol }).format(): currency(amount).format();
}
