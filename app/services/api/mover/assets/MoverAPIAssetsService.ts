import axios, { AxiosInstance } from 'axios';

import { sameAddress } from 'app/utils/addresses';

import {
  getMoveAssetData,
  getMoveWethLPAssetData,
  getUBTAssetData,
  getUSDCAssetData
} from 'app/references/assets';
import { Network } from 'app/references/network';
import { PermitData, Token } from 'app/references/tokens';
import {
  AssetData,
  CommonPricesReturn,
  FindAssetsRequest,
  GetHistorySelectedTokenPricesItems,
  GetHistorySelectedTokenPricesRequest,
  GetHistoryTokenPricesRequest,
  GetMultiChainWalletTokensResponse,
  GetPermitDataResponse,
  GetTokenPricesInput,
  GetTokenPricesRequest,
  HistoryPricesReturn,
  PricesResponse,
  PricesReturn,
  SelectedHistoryPricesReturn,
  WalletResponse
} from 'app/services/api/mover/assets/types';
import { MoverAPIService } from 'app/services/api/mover/MoverAPIService';
import { MoverAPISuccessfulResponse } from 'app/services/api/mover/types';
import { addSentryBreadcrumb, captureSentryException } from "../../../../logs/sentry"

export class MoverAssetsService extends MoverAPIService {
  protected readonly client: AxiosInstance;

  protected readonly baseURL: string;

  protected tokensCache = new Map<Network, Array<Token>>();

  constructor() {
    super('assets.service');
    this.baseURL = process.env.VUE_APP_API_ASSETS_SERVICE_URL || '';

    this.client = this.applyAxiosInterceptors(axios.create({ baseURL: this.baseURL }));
  }

  public async getTokenPrices(tokensToCheck: GetTokenPricesInput): Promise<PricesReturn> {
    return (
      await this.client.post<MoverAPISuccessfulResponse<PricesResponse>>(`prices/tokens`, {
        tokens: tokensToCheck
      } as GetTokenPricesRequest)
    ).data.payload.tokens;
  }

  public async getSelectedTokenHistoryPrices(
    items: GetHistorySelectedTokenPricesItems
  ): Promise<SelectedHistoryPricesReturn> {
    return (
      await this.client.post<MoverAPISuccessfulResponse<SelectedHistoryPricesReturn>>(
        `/prices/v2/selected/history`,
        {
          items: items
        } as GetHistorySelectedTokenPricesRequest
      )
    ).data.payload;
  }

  public async getHistoryTokenPrices(unixTs: number): Promise<HistoryPricesReturn> {
    return (
      await this.client.post<MoverAPISuccessfulResponse<HistoryPricesReturn>>(
        `prices/tokens/history`,
        {
          timestamp: unixTs
        } as GetHistoryTokenPricesRequest
      )
    ).data.payload;
  }

  public async getCommonPrices(): Promise<CommonPricesReturn> {
    const commonAssets = (
      await this.client.get<MoverAPISuccessfulResponse<PricesResponse>>(`prices/common`)
    ).data.payload.tokens;

    const moveEthData = getMoveAssetData(Network.ethereum);
    const ubtEthData = getUBTAssetData(Network.ethereum);
    const usdcEthData = getUSDCAssetData(Network.ethereum);
    const usdcPolygonData = getUSDCAssetData(Network.polygon);
    const usdcBinanceData = getUSDCAssetData(Network.binance);
    const usdcFantomData = getUSDCAssetData(Network.fantom);
    const usdcAvalanceData = getUSDCAssetData(Network.avalanche);
    const usdcArbitrumData = getUSDCAssetData(Network.arbitrum);
    const usdcOptimismData = getUSDCAssetData(Network.optimism);
    const movelpEthData = getMoveWethLPAssetData(Network.ethereum);

    return {
      ethereumMOVEPrice:
        commonAssets.find(
          (asset) =>
            sameAddress(asset.address, moveEthData.address) && asset.network === moveEthData.network
        )?.price ?? '0',
      ethereumUBTPrice:
        commonAssets.find(
          (asset) =>
            sameAddress(asset.address, ubtEthData.address) && asset.network === ubtEthData.network
        )?.price ?? '0',
      ethereumUSDCPrice:
        commonAssets.find(
          (asset) =>
            sameAddress(asset.address, usdcEthData.address) && asset.network === usdcEthData.network
        )?.price ?? '0',
      polygonUSDCPrice:
        commonAssets.find(
          (asset) =>
            sameAddress(usdcPolygonData.address, asset.address) &&
            asset.network === usdcPolygonData.network
        )?.price ?? '0',
      binanceUSDCPrice:
        commonAssets.find(
          (asset) =>
            sameAddress(usdcBinanceData.address, asset.address) &&
            asset.network === usdcBinanceData.network
        )?.price ?? '0',
      fantomUSDCPrice:
        commonAssets.find(
          (asset) =>
            sameAddress(usdcFantomData.address, asset.address) &&
            asset.network === usdcFantomData.network
        )?.price ?? '0',
      avalancheUSDCPrice:
        commonAssets.find(
          (asset) =>
            sameAddress(usdcAvalanceData.address, asset.address) &&
            asset.network === usdcAvalanceData.network
        )?.price ?? '0',
      arbitrumUSDCPrice:
        commonAssets.find(
          (asset) =>
            sameAddress(usdcArbitrumData.address, asset.address) &&
            asset.network === usdcArbitrumData.network
        )?.price ?? '0',
      optimismUSDCPrice:
        commonAssets.find(
          (asset) =>
            sameAddress(usdcOptimismData.address, asset.address) &&
            asset.network === usdcOptimismData.network
        )?.price ?? '0',
      ethereumMOVELPPrice:
        commonAssets.find(
          (asset) =>
            sameAddress(asset.address, movelpEthData.address) &&
            asset.network === movelpEthData.network
        )?.price ?? '0'
    };
  }

  public async getMultiChainWalletTokens(
    address: string,
    confirmationSignature: string
  ): Promise<GetMultiChainWalletTokensResponse> {
    const data = (
      await this.client.get<MoverAPISuccessfulResponse<WalletResponse>>(
        `private/wallet/multichain/balances`,
        {
          headers: this.getAuthHeaders(address, confirmationSignature)
        }
      )
    ).data.payload;

    return {
      tokens: data.tokens.map((t) => ({
        name: t.token.name,
        decimals: t.token.decimals,
        symbol: t.token.symbol,
        address: t.token.address,
        iconURL: t.token.logoUrl,
        network: t.token.network,
        hasPermit: t.token.hasPermit,
        permitType: t.token.permitType,
        permitVersion: t.token.permitVersion,
        priceUSD: t.price,
        balance: t.balance
      })),
      nfts: data.nfts
    };
  }

  public async getAllTokens(network: Network): Promise<Array<Token>> {
    const cachedData = this.tokensCache.get(network);
    if (cachedData !== undefined) {
      return cachedData;
    }

    const assets = await this.getAssetsList(network);

    this.tokensCache.set(network, assets);

    return assets;
  }

  public async getTokenData(tokenAddress: string, network: Network): Promise<Token> {
    try {
      const respData = (
        await this.client.get<MoverAPISuccessfulResponse<AssetData>>(
          `/token/${network}/${tokenAddress}`
        )
      ).data.payload;

      return {
        name: respData.name,
        decimals: respData.decimals,
        symbol: respData.symbol,
        address: respData.address,
        iconURL: respData.logoUrl ?? '',
        network: respData.network
      };
    } catch (err) {
      addSentryBreadcrumb({
        type: 'error',
        message: `failed get token data from "/token/${network}/${tokenAddress}"`,
        category: this.sentryCategoryPrefix,
        data: {
          error: err
        }
      });
      captureSentryException(err);
      return {
        name: '',
        decimals: 18,
        symbol: '',
        address: tokenAddress,
        iconURL: '',
        network: network
      };
    }
  }

  public async getPermitData(tokenAddress: string, network: Network): Promise<PermitData> {
    try {
      const respData = (
        await this.client.get<MoverAPISuccessfulResponse<GetPermitDataResponse>>(
          `/token/${network}/${tokenAddress}/permit`
        )
      ).data.payload;

      return {
        hasPermit: respData.hasPermit,
        permitType: respData.permitType,
        permitVersion: respData.permitVersion
      };
    } catch (err) {
      addSentryBreadcrumb({
        type: 'error',
        message: `failed get permit data from "/token/${network}/${tokenAddress}/permit"`,
        category: this.sentryCategoryPrefix,
        data: {
          error: err
        }
      });
      captureSentryException(err);
      return {
        hasPermit: false
      };
    }
  }

  private async getAssetsList(network: Network): Promise<Array<Token>> {
    return (
      await this.client.get<MoverAPISuccessfulResponse<Array<AssetData>>>(`tokens/${network}`)
    ).data.payload.map((t) => ({
      name: t.name,
      decimals: t.decimals,
      symbol: t.symbol,
      address: t.address,
      iconURL: t.logoUrl ?? '',
      network: t.network
    }));
  }

  public async findAssets(input: FindAssetsRequest): Promise<Array<Token>> {
    return (
      await this.client.post<MoverAPISuccessfulResponse<Array<AssetData>>>(`tokens/find`, input)
    ).data.payload.map((t) => ({
      name: t.name,
      decimals: t.decimals,
      symbol: t.symbol,
      address: t.address,
      iconURL: t.logoUrl ?? '',
      network: t.network
    }));
  }
}
