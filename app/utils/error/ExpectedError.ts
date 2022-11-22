import { MoverError } from '../../services/MoverError';

export enum EECode {
  userRejectAuth = 'errors.userRejectAuth',
  userRejectOwnershipSignature = 'errors.userRejectConfirmationSignature',
  userRejectNetworkChange = 'errors.userRejectNetworkChange',
  userRejectSign = 'errors.userRejectSign',
  userRejectTransaction = 'errors.userRejectTransaction',
  addNetworkToProvider = 'errors.addNetworkToProvider',
  swapInsufficientLiquidity = 'errors.swapInsufficientLiquidity',
  switchProviderNetwork = 'errors.switchProviderNetwork',
  swapUnsupportedToken = 'errors.swapUnsupportedToken',
  withdrawUnsupportedNetwork = 'errors.withdrawUnsupportedNetwork',
  avatarSave = 'errors.avatarSave',
  avatarNotSelected = 'errors.avatarNotSelected',
  avatarInvalidFormat = 'errors.avatarInvalidFormat'
}

export class ExpectedError extends MoverError {
  constructor(protected readonly code: EECode) {
    super(`Expected error with code: ${code}`);
  }

  public getCode(): EECode {
    return this.code;
  }
}
