import { sameAddress } from 'app/utils/addresses';
import { Network } from 'app/references/network';
import { NFT, NFTKind } from 'app/references/nfts';
import { PermitData, TokenWithBalance } from 'app/references/tokens';

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
  nfts: Array<{
    name: NFTKind;
    hasBalance: boolean;
  }>;
};

export type GetMultiChainWalletTokensResponse = {
  tokens: Array<TokenWithBalance & PermitData>;
  nfts: Array<NFT>;
};

export type FindAssetRequestItem = {
  tokenAddress: string;
  network: Network;
};

export type FindAssetsRequest = Array<FindAssetRequestItem>;

export type HistoryPricesReturnItem = {
  address: string;
  network: Network;
  price: string;
  timestamp: number;
};

export type GetHistorySelectedTokenPricesRequest = {
  items: GetHistorySelectedTokenPricesItems;
};

export type GetHistorySelectedTokenPricesItems = Array<GetHistorySelectedTokenPricesItem>;

type GetHistorySelectedTokenPricesItem = {
  address: string;
  network: Network;
  timestamp: number;
};

export type SelectedHistoryPricesReturn = Array<HistoryPricesReturnItem>;

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
  resp: SelectedHistoryPricesReturn,
  timestamp: number,
  network: Network,
  address: string
): string | undefined => {
  return resp.find(
    (item) =>
      sameAddress(item.address, address) && item.network === network && item.timestamp === timestamp
  )?.price;
};
