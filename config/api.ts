import { APPLICATION_NAME } from "./events";

const API_URL = "https://api.coingecko.com/api/v3"
const API_MORALIS_URL = "https://deep-index.moralis.io/api/v2"
export const TOKEN_LOGO_URL = "https://raw.githubusercontent.com/trustwallet/assets/9af1b653778b5ee8f9207dc4440c7ee22e8ce5b7/blockchains/ethereum/tokenlist.json"
const timeout = 10000
export const GAS_STATION_URL = "https://ethgasstation.info/api"
export const API_HUMANIQ_URL = "https://signupbot.humaniq.com/api/v1"
export const API_FINANCE = "https://apifinance.humaniq.com/api/v1"
export const API_EVENTS = 'https://appevents.humaniq.com/api/v1'

export interface ApiConfig {
    url: string;
    moralisUrl: string;
    timeout: number;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
    url: API_URL,
    moralisUrl: API_MORALIS_URL,
    timeout
}

export const GAS_STATION_ROUTES = {
    GET_GAS_FEE: "ethgasAPI.json"
}

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
        UPDATE_PATH: "/api/v1/users/profile/",
        GET: "/api/v1/users/profile/"
    }
}


export const MORALIS_ROUTES = {
    ACCOUNT: {
        GET_TRANSACTIONS: '/:address',
        GET_ERC20_BALANCES: '/:address/erc20',
        GET_ERC20_TRANSFERS: '/:address/erc20/transfers'
    },
    TOKEN: {
        GET_ERC20_METADATA: '/erc20/metadata',
        GET_ERC20_PRICE: '/erc20/:address/price'
    }
}

export const COINGECKO_ROUTES = {
    GET_TOKEN_PRICE: '/simple/price'
}

export const HUMANIQ_ROUTES = {
    INTROSPECT: {
        POST_SIGNUP_CHECK: "/introspect/signup/check",
        POST_SIGNUP_CONFIRM: "/introspect/signup/confirm",
        GET_SIGNUP_OBJECT: "/introspect/signup/object/:uid",
        GET_SIGNUP_PHOTO: "/introspect/signup/photo/:uid",
        GET_SIGNUP_WALLET: "/introspect/signup/wallet/:wallet"
    }
}

export const FINANCE_ROUTES = {
    GET_PRICES: "/prices/list",
    GET_WALLET_LIST: "/wallet/tokens/:chainId/:walletAddress"
}

export const EVENTS_ROUTES = {
    POST_CLIENT_DATA: `${APPLICATION_NAME}/client`,
    POST_SESSION: `${APPLICATION_NAME}/session`,
    POST_EVENT: `${APPLICATION_NAME}/event/:event`
}
