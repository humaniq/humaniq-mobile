export enum BLOCKCHAIN {
  ETHEREUM = "ethereum",
  BITCOIN = "bitcoin"
}

export enum PROVIDER_TYPE {
  infura = "infura",
  rpcProvider = "rpcProvider"
}

export enum ETH_NETWORKS {
  MAINNET = "mainnet",
  ROPSTEN = "ropsten",
  RINKEBY = "rinkeby",
  GOERLI = "goerli"
}


export enum NETWORK_TYPE {
  PRODUCTION = "production",
  TEST = "test"
}

export const ETHEREUM_NETWORKS = {
  [ETH_NETWORKS.MAINNET]: {
    name: ETH_NETWORKS.MAINNET,
    chainID: 1,
    networkID: 1,
    type: ETH_NETWORKS.MAINNET,
    infuraID: "14cb84fb0dbb47f8b5bfb44183e39319",
    infuraSecret: "f07c7f08f27a4ce5aacbc92390b72301"
  },
  [ETH_NETWORKS.ROPSTEN]: {
    name: ETH_NETWORKS.ROPSTEN,
    chainID: 3,
    networkID: 3,
    type: ETH_NETWORKS.ROPSTEN,
    infuraID: "14cb84fb0dbb47f8b5bfb44183e39319",
    infuraSecret: "f07c7f08f27a4ce5aacbc92390b72301"
  },
  [ETH_NETWORKS.RINKEBY]: {
    name: ETH_NETWORKS.RINKEBY,
    chainID: 4,
    networkID: 4,
    type: ETH_NETWORKS.RINKEBY,
    infuraID: "14cb84fb0dbb47f8b5bfb44183e39319",
    infuraSecret: "f07c7f08f27a4ce5aacbc92390b72301"
  },
  [ETH_NETWORKS.GOERLI]: {
    name: ETH_NETWORKS.GOERLI,
    chainID: 5,
    networkID: 5,
    type: ETH_NETWORKS.GOERLI,
    infuraID: "14cb84fb0dbb47f8b5bfb44183e39319",
    infuraSecret: "f07c7f08f27a4ce5aacbc92390b72301"
  },
}

export const BITCOIN_NETWORKS = {}
