import { Network } from './network';
import { getNetworkAddress, getNetworkConstant } from './references';
import { Token } from './tokens';

export const getMoveAssetData = (network: Network): Token => {
  return {
    address: getNetworkAddress(network, 'MOVE_ADDRESS'),
    decimals: 18,
    symbol: 'MOVE',
    name: 'Mover',
    iconURL:
      'https://github.com/trustwallet/assets/raw/master/blockchains/ethereum/assets/0x3FA729B4548beCBAd4EaB6EF18413470e6D5324C/logo.png',
    network
  };
};

export const getMoboAssetData = (network: Network): Token => {
  return {
    address: getNetworkAddress(network, 'MOBO_ADDRESS'),
    decimals: 6,
    symbol: 'MOBO',
    name: 'Mover Bonus Token',
    iconURL: '',
    network
  };
};

export const getBTRFLYAssetData = (network: Network): Token => {
  return {
    address: getNetworkAddress(network, 'BTRFLY_TOKEN_ADDRESS'),
    decimals: 9,
    symbol: 'BTRFLY',
    iconURL: 'https://assets.coingecko.com/coins/images/21718/small/3.png?1640248507',
    name: 'BTRFLY',
    network
  };
};

export const getALCXAssetData = (network: Network): Token => {
  return {
    address: getNetworkAddress(network, 'ALCX_TOKEN_ADDRESS'),
    decimals: 18,
    symbol: 'ALCX',
    iconURL: 'https://assets.coingecko.com/coins/images/14113/small/Alchemix.png',
    name: 'Alchemix',
    network
  };
};

export const getCULTAssetData = (network: Network): Token => {
  return {
    address: getNetworkAddress(network, 'CULT_TOKEN_ADDRESS'),
    decimals: 18,
    symbol: 'CULT',
    iconURL: 'https://assets.coingecko.com/coins/images/23331/small/quxZPrbC_400x400.jpg',
    name: 'Cult DAO ',
    network
  };
};

export const getMoveWethLPAssetData = (network: Network): Token => {
  return {
    address: getNetworkAddress(network, 'SUSHISWAP_MOVE_WETH_POOL_ADDRESS'),
    decimals: 18,
    symbol: 'SLP',
    name: 'SushiSwap LP Token',
    iconURL: 'https://protocol-icons.s3.amazonaws.com/sushi-exchange.png',
    network
  };
};

export const getOhmAssetData = (network: Network): Token => {
  return {
    address: getNetworkAddress(network, 'OHM_ADDRESS'),
    symbol: 'OHM',
    decimals: 9,
    iconURL:
      'https://assets.coingecko.com/coins/images/14483/large/token_OHM_%281%29.png?1628311611',
    name: 'Olympus',
    network
  };
};

export const getUSDCAssetData = (network: Network): Token => {
  return {
    address: getNetworkAddress(network, 'USDC_TOKEN_ADDRESS'),
    decimals: getNetworkConstant(network, 'USDC_SPECIFIC_DECIMALS') ?? 6,
    symbol: 'USDC',
    iconURL: 'https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
    name: 'USD Coin',
    network
  };
};

export const getEURSAssetData = (network: Network): Token => {
  return {
    address: getNetworkAddress(network, 'EURS_TOKEN_ADDRESS'),
    decimals: 2,
    symbol: 'EURS',
    iconURL: 'https://token-icons.s3.amazonaws.com/0xdb25f211ab05b1c97d595516f45794528a807ad8.png',
    name: 'STASIS EURS Token',
    network
  };
};

export const getUBTAssetData = (network: Network): Token => {
  return {
    address: getNetworkAddress(network, 'UBT_TOKEN_ADDRESS'),
    decimals: 8,
    symbol: 'UBT',
    name: 'Unibright',
    iconURL:
      'https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0x8400D94A5cb0fa0D041a3788e395285d61c9ee5e/logo.png',
    network
  };
};

export const getAssetsForTreasury = (network: Network): Array<Token> => {
  const move = getMoveAssetData(network);
  const slp = getMoveWethLPAssetData(network);
  return [move, slp];
};
