import currency from "currency.js";

const pow = Math.pow;
const floor = Math.floor;
const abs = Math.abs;
const log = Math.log;

const abbrev = "KMBTQ";

function round(n, precision) {
  const prec = Math.pow(10, precision);
  return Math.round(n * prec) / prec;
}

export function amountFormat(amount, number) {
  return currency(amount, { precision: number, symbol: "" }).format();
}

export function currencyFormat(amount, symbol?: string) {
  return symbol ? currency(amount, { symbol }).format() : currency(amount).format();
}

export function preciseRound(n) {
  return parseFloat(
      n.toExponential(~~Math.max(1, 2 + Math.log10(Math.abs(n))))
  );
}

// const intlSimple = Intl.NumberFormat();
//
// export function formatToNumber(number) {
//   return intlSimple.format(number);
// }

export function beautifyNumber(n, symbol?: string) {
  let base = floor(log(abs(n)) / log(1000));
  const suffix = abbrev[Math.min(4, base - 1)];
  base = abbrev.indexOf(suffix) + 1;
  const rounded = round(n / pow(1000, base), 2);

  return symbol
      ? suffix
          ? currencyFormat(rounded, symbol) + suffix
          : currencyFormat(n, symbol)
      : suffix
          ? rounded + suffix
          : n;
}

export function stringToIntHash(str, upperbound, lowerbound) {
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    result = result + str.charCodeAt(i);
  }

  if (!lowerbound) lowerbound = 0;
  if (!upperbound) upperbound = 500;

  return (result % (upperbound - lowerbound)) + lowerbound;
}
