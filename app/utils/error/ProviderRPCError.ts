import { CustomError } from 'ts-custom-error';

export interface ProviderRpcError extends CustomError {
  code: number;
  data?: unknown;
}

export const isProviderRpcError = (error: unknown): error is ProviderRpcError => {
  if (!(error instanceof Object)) {
    return false;
  }

  const candidate = error as Partial<ProviderRpcError>;
  return !(candidate.message === undefined || candidate.code === undefined);
};

export const isUnrecognizedChainError = (error: unknown): boolean => {
  if (
    isProviderRpcError(error) &&
    (error.code === ProviderRpcErrorCode.Internal ||
      error.code === ProviderRpcErrorCode.UnrecognizedChain)
  ) {
    return true;
  }

  if (error instanceof Error && error.message.startsWith('Unrecognized chain ID')) {
    return true;
  }

  return false;
};

export const isRejectedRequestError = (error: unknown): boolean => {
  if (isProviderRpcError(error) && error.code === ProviderRpcErrorCode.UserRejectedRequest) {
    return true;
  }

  if (error instanceof Error) {
    if (error.message === WalletConnectErrorSignature.FailedOrRejectedRequest) {
      return true;
    }

    if (error.message === MetamaskErrorSignature.UserDeniedMessageSignature) {
      return true;
    }

    if (error.message === TrustWalletErrorSignature.UserCanceled) {
      return true;
    }
  }

  return false;
};

export enum ProviderRpcErrorCode {
  InvalidInput = -32000,
  ResourceNotFound = -32001,
  ResourceUnavailable = -32002,
  TransactionRejected = -32003,
  MethodNotSupported = -32004,
  LimitExceeded = -32005,
  Parse = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  Internal = -32603,
  UserRejectedRequest = 4001,
  Unauthorized = 4100,
  UnsupportedMethod = 4200,
  Disconnected = 4900,
  ChainDisconnected = 4901,
  UnrecognizedChain = 4902
}

export enum WalletConnectErrorSignature {
  FailedOrRejectedRequest = 'Failed or Rejected Request'
}

export enum TrustWalletErrorSignature {
  UserCanceled = 'User canceled'
}

export enum MetamaskErrorSignature {
  UserDeniedMessageSignature = 'MetaMask Personal Message Signature: User denied message signature.'
}
