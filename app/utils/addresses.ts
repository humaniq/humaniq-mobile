import { BigNumber } from 'bignumber.js';

export const sameAddress = (addr1?: string | null, addr2?: string | null): boolean => {
  if (addr1 === undefined || addr1 === null || addr2 === undefined || addr2 === null) {
    return false;
  }
  return addr1.toLowerCase() === addr2.toLowerCase();
};

export const getPureBaseAssetAddress = (): string => '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const convertStringToHexWithPrefix = (stringToConvert: string): string =>
  `0x${new BigNumber(stringToConvert).toString(16)}`;

export const isValidTxHash = (txHash: string): boolean => {
  return /^0x([A-Fa-f0-9]{64})$/.test(txHash);
};
