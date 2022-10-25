export enum BLOCKCHAIN {
  EVM = "evm",
  BITCOIN = "bitcoin"
}

export enum NATIVE_COIN {
  ETHEREUM = 'ethereum',
  BINANCECOIN = 'binancecoin'
}

export enum NATIVE_COIN_SYMBOL {
  ETH = "eth",
  BNB = "bnb"
}

export enum PROVIDER_TYPE {
  infura = "infura",
  rpcProvider = "rpcProvider"
}

export enum EVM_NETWORKS_NAMES {
  MAINNET = "mainnet",
  GOERLI = "goerli",
  SEPOLIA = "sepolia",
  BSC = 'bsc',
  BSC_TESTNET = 'bcs testnet'
}

export enum NETWORK_TYPE {
  PRODUCTION = "production",
  TEST = "test"
}

export interface EVM_NETWORK {
  name: EVM_NETWORKS_NAMES
  chainID: number
  networkID: number,
  type: EVM_NETWORKS_NAMES,
  providerID?: string
  providerSecret?: string
  env: NETWORK_TYPE
  nativeCoin: NATIVE_COIN
  nativeSymbol: NATIVE_COIN_SYMBOL

}

export const EVM_NETWORKS: {[key: string]: EVM_NETWORK} = {
  [EVM_NETWORKS_NAMES.BSC]: {
    name: EVM_NETWORKS_NAMES.BSC,
    chainID: 56,
    networkID: 56,
    type: EVM_NETWORKS_NAMES.BSC,
    env: NETWORK_TYPE.PRODUCTION,
    nativeCoin: NATIVE_COIN.BINANCECOIN,
    nativeSymbol: NATIVE_COIN_SYMBOL.BNB
  },
  [EVM_NETWORKS_NAMES.BSC_TESTNET]: {
    name: EVM_NETWORKS_NAMES.BSC_TESTNET,
    chainID: 97,
    networkID: 97,
    type: EVM_NETWORKS_NAMES.BSC_TESTNET,
    env: NETWORK_TYPE.TEST,
    nativeCoin: NATIVE_COIN.BINANCECOIN,
    nativeSymbol: NATIVE_COIN_SYMBOL.BNB
  },
  [EVM_NETWORKS_NAMES.MAINNET]: {
    name: EVM_NETWORKS_NAMES.MAINNET,
    chainID: 1,
    networkID: 1,
    type: EVM_NETWORKS_NAMES.MAINNET,
    providerID: "14cb84fb0dbb47f8b5bfb44183e39319",
    providerSecret: "f07c7f08f27a4ce5aacbc92390b72301",
    env: NETWORK_TYPE.PRODUCTION,
    nativeCoin: NATIVE_COIN.ETHEREUM,
    nativeSymbol: NATIVE_COIN_SYMBOL.ETH
  },
  [EVM_NETWORKS_NAMES.GOERLI]: {
    name: EVM_NETWORKS_NAMES.GOERLI,
    chainID: 5,
    networkID: 5,
    type: EVM_NETWORKS_NAMES.GOERLI,
    providerID: "14cb84fb0dbb47f8b5bfb44183e39319",
    providerSecret: "f07c7f08f27a4ce5aacbc92390b72301",
    env: NETWORK_TYPE.TEST,
    nativeCoin: NATIVE_COIN.ETHEREUM,
    nativeSymbol: NATIVE_COIN_SYMBOL.ETH
  },
  [EVM_NETWORKS_NAMES.SEPOLIA]: {
    name: EVM_NETWORKS_NAMES.SEPOLIA,
    chainID: 11155111,
    networkID: 11155111,
    type: EVM_NETWORKS_NAMES.SEPOLIA,
    providerID: "14cb84fb0dbb47f8b5bfb44183e39319",
    providerSecret: "f07c7f08f27a4ce5aacbc92390b72301",
    env: NETWORK_TYPE.TEST,
    nativeCoin: NATIVE_COIN.ETHEREUM,
    nativeSymbol: NATIVE_COIN_SYMBOL.ETH
  },
}

export const BITCOIN_NETWORKS = {}
