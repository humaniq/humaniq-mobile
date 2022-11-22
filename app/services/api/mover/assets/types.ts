import { Network } from '@/references/network';

export type AssetData = {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  logoUrl: string;
  network: Network;
  hasPermit: boolean;
  permitType?: string;
  permitVersion?: string;
};

export type GetPermitDataResponse = {
  hasPermit: boolean;
  permitVersion?: string;
  permitType?: string;
};

export type WalletResponse = {
  tokens: Array<{
    token: AssetData;
    price: string;
    balance: string;
  }>;
};

export type GetHistorySelectedTokenPricesRequest = {
  timestamps: GetHistorySelectedTokenPricesInput;
};

export type GetHistorySelectedTokenPricesInput = Record<
  number,
  {
    address: string;
    network: Network;
  }
>;

export type GetTokenPricesInput = Array<{
  address: string;
  network: Network;
}>;

export type GetTokenPricesRequest = {
  tokens: Array<{
    address: string;
    network: Network;
  }>;
};

export type GetHistoryTokenPricesRequest = {
  timestamp: number;
};

export type HistoryPricesReturn = Record<Network, Record<string, string>>;

export type GetMultiHistoryTokenPricesRequest = {
  timestamps: Array<number>;
};

export type MultiHistoryPricesReturn = Record<number, Record<Network, Record<string, string>>>;

export type PricesResponse = {
  tokens: Array<{
    address: string;
    price: string;
    network: Network;
  }>;
};

export type PricesReturn = Array<{
  address: string;
  price: string;
  network: Network;
}>;

export type CommonPricesReturn = {
  ethereumUSDCPrice: string;
  ethereumUBTPrice: string;
  ethereumMOVEPrice: string;
  ethereumMOVELPPrice: string;
  polygonUSDCPrice: string;
  binanceUSDCPrice: string;
  fantomUSDCPrice: string;
  avalancheUSDCPrice: string;
  arbitrumUSDCPrice: string;
  optimismUSDCPrice: string;
};

export const findPriceInResponse = (
  resp: MultiHistoryPricesReturn,
  timestamp: number,
  network: Network,
  address: string
): string | undefined => {
  const sourceLocation = resp[timestamp]?.[network];
  const lowercaseKey = address.toLowerCase();
  return sourceLocation?.[lowercaseKey];
};
