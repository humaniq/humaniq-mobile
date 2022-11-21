import { TokenWithBalance } from "../../../../references/tokens"
import { Network } from "../../../../references/network"

export const mockAssets: Array<TokenWithBalance> = [
  {
    address: "move",
    balance: "0.173185887625448373",
    decimals: 18,
    hasPermit: false,
    iconURL: "https://github.com/trustwallet/assets/raw/master/blockchains/ethereum/assets/0x3FA729B4548beCBAd4EaB6EF18413470e6D5324C/logo.png",
    name: "Mover",
    network: Network.ethereum,
    permitType: undefined,
    permitVersion: undefined,
    priceUSD: "687.39",
    symbol: "MOVE",
  },
  {
    address: "usdc",
    balance: "0.173185887625448373",
    decimals: 18,
    hasPermit: false,
    iconURL: "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
    name: "USD Coin",
    network: Network.ethereum,
    permitType: undefined,
    permitVersion: undefined,
    priceUSD: "1209.8",
    symbol: "USDC",
  },
  {
    address: "eth3",
    balance: "0.173185887625448373",
    decimals: 18,
    hasPermit: false,
    iconURL: "https://github.com/trustwallet/assets/raw/master/blockchains/ethereum/info/logo.png",
    name: "Ether",
    network: Network.ethereum,
    permitType: undefined,
    permitVersion: undefined,
    priceUSD: "1209.8",
    symbol: "ETH",
  },
]
