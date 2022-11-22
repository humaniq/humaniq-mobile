import { Network } from "app/references/network"
import { NFT } from "app/references/nfts"
import { TokenWithBalance } from "app/references/tokens"

export type ExplorerSettings = {
  availableNetworks: Array<Network>;
  currentAccount: string;
  confirmSignature: string;
};

export type WalletTokens = {
  tokens: Array<TokenWithBalance>;
  nfts: Array<NFT>;
};
