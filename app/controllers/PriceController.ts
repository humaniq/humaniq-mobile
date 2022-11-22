import { Network } from "../references/network"
import { makeAutoObservable } from "mobx"
import { moverAssetsService } from "./services/MoverAssets"
import { sameAddress } from "utils/addresses"

export type CachedPrice = {
  value: string;
  expirationTimestampMs: number;
};

export type PriceRecord = {
  address: string;
  network: Network;
  price: string;
};

export type RequestPricePair = {
  address: string;
  network: Network;
};

export class PriceController {

  pricesCache = new Map<string, CachedPrice>()
  ethereumUSDCPrice = "0"
  ethereumUBTPrice = "0"
  ethereumMOVEPrice = "0"
  ethereumMOVELPPrice = "0"
  polygonUSDCPrice = "0"
  binanceUSDCPrice = "0"
  fantomUSDCPrice = "0"
  avalancheUSDCPrice = "0"
  arbitrumUSDCPrice = "0"
  optimismUSDCPrice = "0"

  sentryHookPrefix = "tokenPrice.hook"

  constructor() {
    makeAutoObservable(this, {})
  }

  cacheKey = (contractAddress: string, network: Network): string => {
    return `${ contractAddress }_${ network }`
  }

  setCachedValue = (contractAddress: string, network: Network, price: string) => {
    this.pricesCache.set(this.cacheKey(contractAddress, network), {
      value: price,
      expirationTimestampMs: Date.now() + 5 * 60 * 1000,
    })
  }

  getTokenPrice = async (address: string, network: Network): Promise<string> => {

    const response = await moverAssetsService.getTokenPrices([
      { address: address, network: network },
    ])

    return (
      response.find((t) => sameAddress(t.address, address) && t.network === network)?.price ?? "0"
    )
  }

  loadCommonPrices = async (): Promise<void> => {
    const commonPrices = await moverAssetsService.getCommonPrices();
    this.ethereumMOVEPrice = commonPrices.ethereumMOVEPrice;
    this.ethereumMOVELPPrice = commonPrices.ethereumMOVELPPrice;
    this.ethereumUBTPrice = commonPrices.ethereumUBTPrice;
    this.ethereumUSDCPrice = commonPrices.ethereumUSDCPrice;
    this.polygonUSDCPrice = commonPrices.polygonUSDCPrice;
    this.binanceUSDCPrice = commonPrices.binanceUSDCPrice;
    this.fantomUSDCPrice = commonPrices.fantomUSDCPrice;
    this.avalancheUSDCPrice = commonPrices.avalancheUSDCPrice;
    this.arbitrumUSDCPrice = commonPrices.arbitrumUSDCPrice;
    this.optimismUSDCPrice = commonPrices.optimismUSDCPrice;
  };

}
