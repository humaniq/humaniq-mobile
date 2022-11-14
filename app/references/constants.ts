import { toWei } from 'utils/bigmath';
import { BridgeType } from './bridge';
import { Network } from './network';
import { networks } from './networks';
import { ConstantsMap } from './types';

export const DefaultSlippage = '10';
export const AppName = 'ViaMover';

export const MAX_ASSET_NAME_LENGTH = 30;
export const MIN_TRANSACTION_LIST_UPDATE_RATE = 3 * 1000; // 3 sec
export const TRANSACTION_LIST_PENDING_UPDATE_INTERVAL = 5 * 1000; // 5 sec
export const TRANSACTION_WATCH_VIEW_UPDATE_INTERVAL = 1000; // 1 sec
export const MIN_TOKENS_UPDATE_RATE = 5 * 1000; // 5 sec
export const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 min
export const GLOBAL_UPDATE_RATE = 60 * 1000; // 1 min
export const HEADER_TRANSFORM_DINSTANCE_DESKTOP = 200;
export const HEADER_TRANSFORM_DINSTANCE_MOBILE = 184;
export const TOASTS_TRANSLATE_IN_PX = 8;
export const TOASTS_TIMEOUT = 10 * 1000;

export const networkConstants = {
  [Network.ethereum]: {
    MASTER_CHEF_POOL_INDEX: 257,
    POWERCARD_RARI_ID: 107150,
    ORDER_OF_LIBERTY_DEFAULT_PRICE: toWei('0.1', networks[Network.ethereum].baseAsset.decimals),
    ORDER_OF_LIBERTY_AVAILABLE_PRICES: [
      toWei('1', networks[Network.ethereum].baseAsset.decimals),
      toWei('10', networks[Network.ethereum].baseAsset.decimals)
    ],
    SUBSIDIZED_WALLET_ADDRESSES: [
      '0x213793865Aca451B28fB15bf940b2b7E3aDd34a5',
      '0x70Fb7f7840bD33635a7e33792F2bBeBDCde19889',
      '0xdAc8619CD25a6FEDA197e354235c3bBA7d847b90'
    ],
    CUSTOM_TOKEN_SLIPPAGE: new Map<string, string>([
      ['0xf0f9d895aca5c8678f706fb8216fa22957685a13', '25']
    ]),
    BRIDGE_TYPE: BridgeType.None
  },
  [Network.fantom]: {
    ORDER_OF_LIBERTY_DEFAULT_PRICE: toWei('10', networks[Network.fantom].baseAsset.decimals),
    ORDER_OF_LIBERTY_AVAILABLE_PRICES: [
      toWei('100', networks[Network.fantom].baseAsset.decimals),
      toWei('1000', networks[Network.fantom].baseAsset.decimals)
    ]
  },
  [Network.polygon]: {
    ORDER_OF_LIBERTY_DEFAULT_PRICE: toWei('10', networks[Network.polygon].baseAsset.decimals),
    ORDER_OF_LIBERTY_AVAILABLE_PRICES: [
      toWei('100', networks[Network.polygon].baseAsset.decimals),
      toWei('1000', networks[Network.polygon].baseAsset.decimals)
    ],
    BRIDGE_TYPE: BridgeType.Across
  },
  [Network.arbitrum]: {
    BRIDGE_TYPE: BridgeType.Across
  },
  [Network.optimism]: {
    BRIDGE_TYPE: BridgeType.Across
  },
  [Network.binance]: {
    USDC_SPECIFIC_DECIMALS: 18
  }
} as ConstantsMap;
