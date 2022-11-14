import BigNumber from 'bignumber.js';

export const MAXUINT256 = new BigNumber(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
).toFixed();

export const convertToString = (numberOne: BigNumber.Value): string =>
  new BigNumber(numberOne).toFixed();

export const getInteger = (numberOne: BigNumber.Value): string =>
  new BigNumber(numberOne).toFixed(0);

export const isEqual = (numberOne: BigNumber.Value, numberTwo: BigNumber.Value): boolean =>
  new BigNumber(numberOne).isEqualTo(new BigNumber(numberTwo));

export const add = (numberOne: BigNumber.Value, numberTwo: BigNumber.Value): string =>
  new BigNumber(numberOne).plus(numberTwo).toFixed();

export const clampLeft = (numberOne: BigNumber.Value): string =>
  BigNumber.max(numberOne, '0').toFixed();

export const sub = (numberOne: BigNumber.Value, numberTwo: BigNumber.Value): string =>
  new BigNumber(numberOne).minus(numberTwo).toFixed();

export const multiply = (x: BigNumber.Value, y: BigNumber.Value): string =>
  new BigNumber(x).times(y).toFixed();

export const divide = (numberOne: BigNumber.Value, numberTwo: BigNumber.Value): string => {
  if (!(numberOne || numberTwo)) return '0';
  return new BigNumber(numberOne).dividedBy(numberTwo).toFixed();
};

export const greaterThan = (numberOne: BigNumber.Value, numberTwo: BigNumber.Value): boolean =>
  new BigNumber(numberOne).gt(numberTwo);

export const greaterThanOrEqual = (
  numberOne: BigNumber.Value,
  numberTwo: BigNumber.Value
): boolean => new BigNumber(numberOne).gte(numberTwo);

export const lessThan = (numberOne: BigNumber.Value, numberTwo: BigNumber.Value): boolean =>
  new BigNumber(numberOne).lt(numberTwo);

export const lessThanOrEqual = (numberOne: BigNumber.Value, numberTwo: BigNumber.Value): boolean =>
  new BigNumber(numberOne).lte(numberTwo);

export const isZero = (value: BigNumber.Value): boolean => new BigNumber(value).isZero();

export const notZero = (numberOne: BigNumber.Value): boolean => new BigNumber(numberOne).gt('0');

export const toWei = (value: BigNumber.Value, decimals: number | string): string =>
  new BigNumber(value).times(new BigNumber(10).pow(decimals)).toFixed();

export const fromWei = (value: BigNumber.Value, decimals: number | string): string =>
  new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals)).toFixed();

export const floorDivide = (numberOne: BigNumber.Value, numberTwo: BigNumber.Value): string =>
  new BigNumber(numberOne).dividedToIntegerBy(new BigNumber(numberTwo)).toFixed();

export const isNaN = (num: BigNumber.Value): boolean => {
  return new BigNumber(num).isNaN();
};

export const isFinite = (num: BigNumber.Value): boolean => {
  return new BigNumber(num).isFinite();
};

export const roundToPrecision = (value: BigNumber.Value, decimals = 18): string => {
  return new BigNumber(value).toFixed(decimals, BigNumber.ROUND_DOWN);
};

export const convertAmountFromNativeValue = (
  value: BigNumber.Value,
  priceUnit: BigNumber.Value,
  decimals = 18
): string => {
  if (isZero(priceUnit)) return '0';
  return new BigNumber(
    new BigNumber(value).dividedBy(priceUnit).toFixed(decimals, BigNumber.ROUND_DOWN)
  ).toFixed();
};

export const convertNativeAmountFromAmount = (
  value: BigNumber.Value,
  priceUnit: BigNumber.Value
): string => {
  if (isZero(priceUnit)) return '0';
  return new BigNumber(
    new BigNumber(value).times(priceUnit).toFixed(18, BigNumber.ROUND_DOWN)
  ).toFixed();
};
