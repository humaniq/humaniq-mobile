import { Network } from '../../../../references/network';
import { SmallTokenInfo } from '../../../../references/tokens';
import { TransactionType } from '../transactions/types';

export enum State {
  Pending = 'pending',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Queued = 'queued'
}

export enum InternalTransactionType {
  Approve = 'approve',
  Swap = 'swap',
  Bridge = 'bridge',
  Deposit = 'deposit',
  Withdraw = 'withdraw',
  TopUp = 'top_up',
  Unwrap = 'unwrap',
  Confirm = 'confirm'
}

export type TransactionStateItem = {
  index: number;
  type: InternalTransactionType;
  state: State;
  estimation: number;
  network: Network;
  token: SmallTokenInfo;
  timestamp: number;
  hash?: string;
};

export type TransactionScenario = {
  type: TransactionType;
  startNetwork: Network;
  toNetwork: Network;
  steps: Array<TransactionStateItem>;
};
