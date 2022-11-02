import { getAPIKey } from "./keys";
import { Network } from './network';
import { NetworkInfoMap } from './types';

export const AvailableNetworks: Array<Network> = [
  Network.ethereum,
  Network.arbitrum,
  Network.optimism,
  //Network.fantom,
  //Network.avalanche,
  //Network.binance,
  Network.polygon
];

export const networks: NetworkInfoMap = {
  [Network.ethereum]: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    network: Network.ethereum,
    explorer: 'https://etherscan.io',
    subsidizedUrl: 'https://api.viamover.com/api/v1',
    iconURL: require('../assets/images/icons/networks/icon-ethereum.svg'),
    baseAsset: {
      address: 'eth',
      decimals: 18,
      symbol: 'ETH',
      name: 'Ether',
      iconURL:
        'https://github.com/trustwallet/assets/raw/master/blockchains/ethereum/info/logo.png',
      network: Network.ethereum
    },
    rpcUrl: [
      `https://mainnet.infura.io/v3/${getAPIKey('INFURA_PROJECT_ID')}`,
      'https://api.mycryptoapi.com/eth',
      'https://cloudflare-eth.com'
    ],
    displayedName: 'Ethereum'
  },
  [Network.polygon]: {
    chainId: 137,
    name: 'Polygon Mainnet',
    network: Network.polygon,
    explorer: 'https://polygonscan.com',
    subsidizedUrl: undefined,
    iconURL: require('../assets/images/icons/networks/icon-polygon.svg'),
    baseAsset: {
      address: 'matic',
      decimals: 18,
      symbol: 'MATIC',
      name: 'Matic',
      iconURL: 'https://github.com/trustwallet/assets/raw/master/blockchains/polygon/info/logo.png',
      network: Network.polygon
    },
    rpcUrl: [`https://polygon-rpc.com/`],
    displayedName: 'Polygon'
  },
  [Network.binance]: {
    chainId: 56,
    name: 'Binance Smart Chain Mainnet',
    network: Network.binance,
    explorer: 'https://bscscan.com',
    subsidizedUrl: undefined,
    iconURL: require('../assets/images/icons/networks/icon-binance.svg'),
    baseAsset: {
      address: 'bsc',
      decimals: 18,
      symbol: 'BNB',
      name: 'Binance Chain Native Token',
      iconURL:
        'https://github.com/trustwallet/assets/raw/master/blockchains/smartchain/info/logo.png',
      network: Network.binance
    },
    rpcUrl: [
      'https://bsc-dataseed1.binance.org',
      'https://bsc-dataseed2.binance.org',
      'https://bsc-dataseed3.binance.org',
      'https://bsc-dataseed4.binance.org',
      'https://bsc-dataseed1.defibit.io',
      'https://bsc-dataseed2.defibit.io',
      'https://bsc-dataseed3.defibit.io',
      'https://bsc-dataseed4.defibit.io',
      'https://bsc-dataseed1.ninicoin.io',
      'https://bsc-dataseed2.ninicoin.io',
      'https://bsc-dataseed3.ninicoin.io',
      'https://bsc-dataseed4.ninicoin.io',
      'wss://bsc-ws-node.nariox.org'
    ],
    displayedName: 'Binance'
  },
  [Network.avalanche]: {
    chainId: 43114,
    name: 'Avalanche C-Chain',
    network: Network.avalanche,
    explorer: 'https://snowtrace.io',
    subsidizedUrl: undefined,
    iconURL: require('../assets/images/icons/networks/icon-avalanche.svg'),
    baseAsset: {
      address: 'avax',
      decimals: 18,
      symbol: 'AVAX',
      name: 'Avalanche',
      iconURL:
        'https://github.com/trustwallet/assets/raw/master/blockchains/avalanchec/info/logo.png',
      network: Network.avalanche
    },
    rpcUrl: ['https://api.avax.network/ext/bc/C/rpc'],
    displayedName: 'Avalanche'
  },
  [Network.arbitrum]: {
    chainId: 42161,
    name: 'Arbitrum One',
    network: Network.arbitrum,
    explorer: 'https://arbiscan.io',
    subsidizedUrl: undefined,
    iconURL: require('../assets/images/icons/networks/icon-arbitrum.svg'),
    baseAsset: {
      address: 'areth',
      decimals: 18,
      symbol: 'ETH',
      name: 'Ether',
      iconURL:
        'https://github.com/trustwallet/assets/raw/master/blockchains/arbitrum/info/logo.png',
      network: Network.arbitrum
    },
    rpcUrl: ['https://arb1.arbitrum.io/rpc'],
    displayedName: 'Arbitrum'
  },
  [Network.fantom]: {
    chainId: 250,
    name: 'Fantom Opera',
    network: Network.fantom,
    explorer: 'https://ftmscan.com',
    subsidizedUrl: undefined,
    iconURL: require('../assets/images/icons/networks/icon-fantom.svg'),
    baseAsset: {
      address: 'ftm',
      decimals: 18,
      symbol: 'FTM',
      name: 'Fantom',
      iconURL: 'https://github.com/trustwallet/assets/raw/master/blockchains/fantom/info/logo.png',
      network: Network.fantom
    },
    rpcUrl: ['https://rpc.ftm.tools/'],
    displayedName: 'Fantom'
  },
  [Network.optimism]: {
    chainId: 10,
    name: 'Optimism',
    network: Network.optimism,
    explorer: 'https://optimistic.etherscan.io',
    subsidizedUrl: undefined,
    iconURL: require('../assets/images/icons/networks/icon-optimism.svg'),
    baseAsset: {
      address: 'oeth',
      decimals: 18,
      symbol: 'ETH',
      name: 'Ether',
      iconURL:
        'https://github.com/trustwallet/assets/raw/master/blockchains/optimism/info/logo.png',
      network: Network.optimism
    },
    rpcUrl: ['https://mainnet.optimism.io/'],
    displayedName: 'Optimism'
  }
};
