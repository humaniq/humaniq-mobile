const API_URL = "https://api.node.psec.pro";
const timeout = 10000;

export interface ApiConfig {
  url: string;
  timeout: number;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: API_URL,
  timeout
};

export const ROUTES = {
  PRICES: {
    GET_ALL_SUPPORT_COINS: "/v1/api/prices/coins/list/prepared/json",
    GET_PRICE_FOR_CURRENT_COIN: "/v1/api/prices/current/{0}",
    GET_ALL_PRICES_FOR_COINS: "/v1/api/prices/all",
    GET_BALANCES_FOR_WALLET: "/v1/api/node/:node/wallet/:address"
  }
};
