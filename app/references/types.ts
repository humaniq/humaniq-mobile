import { BridgeType } from "./bridge"
import { Network } from "./network"
import { Token } from "./tokens"

export type AddressMapKey =
  | "MOVE_ADDRESS"
  | "MOBO_ADDRESS"
  | "TRANSFER_PROXY_ADDRESS"
  | "TOP_UP_PROXY_ADDRESS"
  | "HOLY_SAVINGS_POOL_ADDRESS"
  | "SMART_TREASURY_ADDRESS"
  | "SUSHI_TOKEN_ADDRESS"
  | "SUSHISWAP_MOVE_WETH_POOL_ADDRESS"
  | "OHM_ADDRESS"
  | "USDC_TOKEN_ADDRESS"
  | "WETH_TOKEN_ADDRESS"
  | "NFT_UNEXPECTED_MOVE"
  | "NFT_SWEET_AND_SOUR"
  | "NFT_OLYMPUS"
  | "NFT_VAULTS"
  | "NFT_DICE"
  | "POWERCARD"
  | "POWERCARD_STAKER"
  | "EURS_TOKEN_ADDRESS"
  | "UNISWAP_EURS_WETH_POOL_ADDRESS"
  | "BTRFLY_TOKEN_ADDRESS"
  | "WX_BTRFLY_TOKEN_ADDRESS"
  | "NFT_ORDER_OF_LIBERTY"
  | "UBT_TOKEN_ADDRESS"
  | "STAKING_UBT_CONTRACT_ADDRESS"
  | "NFT_BASELEDGER_STAKING_OG"
  | "ALCX_TOKEN_ADDRESS"
  | "GALCX_TOKEN_ADDRESS"
  | "CULT_TOKEN_ADDRESS"
  | "DCULT_TOKEN_ADDRESS"
  | "SAVINGS_PLUS_POOL_ADDRESS"
  | "ENS_REVERSE_RECORDS_CONTRACT"
  | "ENS_NFT_CONTRACT"
  | "UNS_RESOLVER_CONTRACT"
  | "EXCHANGE_PROXY_ADDRESS"
  | "TOP_UP_EXCHANGE_PROXY_ADDRESS"
  | "AAVE_LANDING_POOL_V3_ADDRESS"
  | "AAVE_LANDING_POOL_V2_ADDRESS"
  | "ACROSS_ADDRESS";

type AddressMapNetworkEntry = Readonly<Record<AddressMapKey, string>>;
export type AddressMap = Readonly<Record<Network, AddressMapNetworkEntry>>;

type ConstantsMapNetworkEntry = Readonly<{
  MASTER_CHEF_POOL_INDEX: number;
  POWERCARD_RARI_ID: number;
  ORDER_OF_LIBERTY_DEFAULT_PRICE: string;
  ORDER_OF_LIBERTY_AVAILABLE_PRICES: Array<string>;
  SUBSIDIZED_WALLET_ADDRESSES: Array<string>;
  CUSTOM_TOKEN_SLIPPAGE: Map<string, string>;
  USDC_SPECIFIC_DECIMALS: number;
  BRIDGE_TYPE: BridgeType;
}>;
export type ConstantsMap = Readonly<Record<Network, ConstantsMapNetworkEntry>>;

export type NetworkInfo = {
  network: Network;
  name: string;
  chainId: number;
  explorer: string;
  subsidizedUrl?: string;
  baseAsset: Token;
  rpcUrl: string[];
  iconURL: number;
  displayedName: string;
};

export type NetworkInfoMap = Record<Network, NetworkInfo>;

export type APIKeys = {
  ZERION_API_KEY: string;
  ZERION_API_KEY_ORIGIN: string;
  ETHERSCAN_API_KEY: string;
  GAS_STATION_API_KEY: string;
  INFURA_PROJECT_ID: string;
  PORTIS_DAPP_ID: string;
  MORALIS_API_KEY: string;
  ANKR_API_KEY: string;
  UNSTOPPABLE_DOMAINS_LOGIN_CLIENT_ID: string;
  ALCHEMY_API_KEY: string;
};
export type PossibleAPIKey = keyof APIKeys;
