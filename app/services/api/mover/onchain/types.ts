import { Contract, ContractSendMethod } from 'web3-eth-contract';

import { SmallTokenInfo } from '../../../../references/tokens';

export type EstimateResponse = {
  error: boolean;
  gasLimit: string;
};

export type CompoundEstimateResponse = {
  approveGasLimit: string;
  actionGasLimit: string;
};

export type CompoundEstimateWithUnwrapResponse = CompoundEstimateResponse & {
  unwrapGasLimit: string;
};

export type UnwrappedData = {
  unwrappedToken: SmallTokenInfo;
  unwrappedTokenPrice: string;
  amountInWei: string;
};

export type WrappedData = {
  wrappedToken: SmallTokenInfo;
  amountInWei: string;
};

export type TransactionsParams = {
  from: string;
  gas?: number;
  gasPrice?: string;
  value?: string;
  maxPriorityFeePerGas?: string | null;
  maxFeePerGas?: string | null;
};

export type AnyFn = () => Promise<unknown>;

export type ContractMethod<T = void> = Omit<ContractSendMethod, 'call'> & {
  call(
    options?: {
      from?: string;
      gasPrice?: string;
      gas?: number;
    },
    callback?: (err: Error, result: T) => void
  ): Promise<T>;
};

export type ERC20ContractMethods = {
  approve(spender: string, amount: string): ContractMethod;
  allowance(owner: string, spender: string): ContractMethod<string>;
};

export type CustomContractType<M> = Omit<Contract, 'methods' | 'clone' | 'deploy'> & {
  methods: M;
};
