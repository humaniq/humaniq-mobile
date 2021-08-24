const API_URL = "https://api.node.psec.pro";
const API_AUTH_URL = "https://eed5-34-134-175-128.ngrok.io";
const timeout = 10000;

export interface ApiConfig {
  url: string;
  authUrl: string;
  timeout: number;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: API_URL,
  authUrl: API_AUTH_URL,
  timeout
};

export const ROUTES = {
  PRICES: {
    GET_ALL_SUPPORT_COINS: "/v1/api/prices/coins/list/prepared/json",
    GET_PRICE_FOR_CURRENT_COIN: "/v1/api/prices/current/{0}",
    GET_ALL_PRICES_FOR_COINS: "/v1/api/prices/all",
    GET_BALANCES_FOR_WALLET: "/v1/api/node/:node/wallet/:address"
  },
  TX: {
    GET_TRANSACTION_DATA: "v1/api/node/:type/helper/transaction",
    SEND_TRANSACTION: "/v1/api/node/:type/broadcast/raw"
  },
  AUTH: {
    REGISTRATION_POST: "/api/v1/users",
    LOGIN_POST: "/api/v1/sessions",
    PROFILE_GET: "/api/v1/users/profile",
    SESSION_CHECK_GET: "/api/v1/sessions",
    SESSION_REFRESH_POST: "/api/v1/sessions/refresh"
  },
  PROFILE: {
    UPDATE_PATH: "/api/v1/users/profile",
    GET: "/api/v1/users/profile"
  }
};
