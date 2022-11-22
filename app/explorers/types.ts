import { Network } from 'app/references/network';

export type ExplorerSettings = {
  availableNetworks: Array<Network>;
  currentAccount: string;
  confirmSignature: string;
};
