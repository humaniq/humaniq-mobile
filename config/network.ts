export enum BLOCKCHAIN {
  EVM = "evm",
  BITCOIN = "bitcoin"
}

export enum PROVIDER_TYPE {
  infura = "infura",
  rpcProvider = "rpcProvider"
}

export enum EVM_NETWORKS_NAMES {
  MAINNET = "mainnet",
  ROPSTEN = "ropsten",
  RINKEBY = "rinkeby",
  GOERLI = "goerli",
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
}

export const EVM_NETWORKS = {
  [EVM_NETWORKS_NAMES.BSC]: {
    name: EVM_NETWORKS_NAMES.BSC,
    chainID: 56,
    networkID: 56,
    type: EVM_NETWORKS_NAMES.BSC,
    env: NETWORK_TYPE.PRODUCTION
  },
  [EVM_NETWORKS_NAMES.BSC_TESTNET]: {
    name: EVM_NETWORKS_NAMES.BSC_TESTNET,
    chainID: 97,
    networkID: 97,
    type: EVM_NETWORKS_NAMES.BSC_TESTNET,
    env: NETWORK_TYPE.TEST
  },
  [EVM_NETWORKS_NAMES.MAINNET]: {
    name: EVM_NETWORKS_NAMES.MAINNET,
    chainID: 1,
    networkID: 1,
    type: EVM_NETWORKS_NAMES.MAINNET,
    providerID: "14cb84fb0dbb47f8b5bfb44183e39319",
    providerSecret: "f07c7f08f27a4ce5aacbc92390b72301",
    env: NETWORK_TYPE.PRODUCTION
  },
  [EVM_NETWORKS_NAMES.ROPSTEN]: {
    name: EVM_NETWORKS_NAMES.ROPSTEN,
    chainID: 3,
    networkID: 3,
    type: EVM_NETWORKS_NAMES.ROPSTEN,
    providerID: "14cb84fb0dbb47f8b5bfb44183e39319",
    providerSecret: "f07c7f08f27a4ce5aacbc92390b72301",
    env: NETWORK_TYPE.TEST
  },
  [EVM_NETWORKS_NAMES.RINKEBY]: {
    name: EVM_NETWORKS_NAMES.RINKEBY,
    chainID: 4,
    networkID: 4,
    type: EVM_NETWORKS_NAMES.RINKEBY,
    providerID: "14cb84fb0dbb47f8b5bfb44183e39319",
    providerSecret: "f07c7f08f27a4ce5aacbc92390b72301",
    env: NETWORK_TYPE.TEST
  },
  [EVM_NETWORKS_NAMES.GOERLI]: {
    name: EVM_NETWORKS_NAMES.GOERLI,
    chainID: 5,
    networkID: 5,
    type: EVM_NETWORKS_NAMES.GOERLI,
    providerID: "14cb84fb0dbb47f8b5bfb44183e39319",
    providerSecret: "f07c7f08f27a4ce5aacbc92390b72301",
    env: NETWORK_TYPE.TEST
  },
}

export const BITCOIN_NETWORKS = {}
