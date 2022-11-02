/* eslint-disable prettier/prettier */
import { Network } from './network';

export type SmallTokenInfo = {
  address: string;
  decimals: number;
  symbol: string;
};

export type Token = SmallTokenInfo & {
  name: string;
  iconURL: string;
  network: Network;
};

export type PermitData = {
  hasPermit: boolean;
  permitVersion?: string;
  permitType?: string
}

export type TokenWithPrice = Token & {
  priceUSD: string;
};

export type TokenWithBalance = TokenWithPrice & Partial<PermitData> & {
  balance: string;
};

export type SmallToken = SmallTokenInfo | Token | TokenWithBalance | TokenWithPrice;

export type InputMode = 'NATIVE' | 'TOKEN';

export const isTokenHasPermitData = (token: TokenWithBalance | (TokenWithBalance & PermitData)): token is (TokenWithBalance & PermitData) => {
  return token.hasPermit !== undefined;
}
