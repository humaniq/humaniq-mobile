import { MoverError } from '../../services/MoverError';

export enum UECode {
  UnsupportedProviderType = 'UPT',
  UnsupportedNetwork = 'UN',
  EmptyProvider = 'EmP',
  EmptyWeb3Provider = 'EmW3P',
  WalletSignEmptyWeb3Provider = 'W-S-EmW3P',
  WalletSignEmptyAddress = 'W-S-EmAddr',
  EmptyAccount = 'EmA',
  ConnectProviderWeb3CleanCache = 'CP-W3-ClCh',
  ConnectCacheProviderWeb3 = 'CCP-W3',
  SignMessage = 'SM',
  metamaskNotInstalled = 'MM-Ni',
  notConnected = 'N-C',
  signErrorVerify = 'S-E-V',
  ValidateTagCommon = 'VT-C',
  ReserveTag = 'ReT',
  GetTagAmount = 'GT-A',
  CantAddApprovalWallet = 'CA-AW',
  CantDeleteApprovalWallet = 'CD-AW',
  ApprovalWalletsLoading = 'AW-L',
  ErrorToInstanceOff = 'Err-Inst-Off',
  UnknownErrorType = 'P-TT-DEF',
  InitTransactionsEmptyAccount = 'IT-EA',
  SelectedTokenUndefined = 'ST_Un',
  SwapDataFetchFailed = 'S-D',
  SavingsPlusDepositTransactionData = 'SP-Dep-TD',
  SavingsPlusDepositEstimation = 'SP-Dep-EST',
  SavingsPlusDepositScenario = 'SP-Dep-Scen',
  SavingsPlusDeposit = 'SP-Dep',
  SavingsPlusEmptyDepositTransactionData = 'EmSP-Dep',
  SavingsPlusWithdrawTransactionData = 'SP-Wit-TD',
  SavingsPlusWithdrawEstimation = 'SP-Wit-EST',
  SavingsPlusEmptyWithdrawTransactionData = 'EmSP-Wit',
  SavingsPlusWithdrawScenario = 'ST-Wit-Scen',
  SavingsPlusWithdraw = 'SP-Wit',
  ChainChange = 'CC-W3',
  StakingDepositEstimation = 'Stak-Dep-EST',
  StakingDepositScenario = 'Stak-Dep-Scen',
  StakingDeposit = 'Stak-Dep',
  StakingWithdrawEstimation = 'Stak-Wit-EST',
  StakingWithdraw = 'Stak-Wit',
  StakingWithdrawScenario = 'Stak-Wit-Scen',
  SmartTreasuryDepositEstimation = 'ST-Dep-EST',
  SmartTreasuryDepositScenario = 'ST-Dep-Scen',
  SmartTreasuryDeposit = 'ST-D',
  SmartTreasuryWithdrawEstimation = 'ST-Wit-EST',
  SmartTreasuryWithdrawScenario = 'ST-Wit-Scen',
  SmartTreasuryWithdraw = 'ST-W',
  CardTopUpEstimation = 'C-TU-EST',
  CardTopUpScenario = 'C-TU-Scen',
  CardTopUpPreparation = 'C-TU-Prep',
  CardTopUp = 'C-TU',
  CardTopUpAcceptError = 'C-TU-A',
  CardTopUpRejectError = 'C-TU-R',
  EmptyConfirmationUponCachedInit = 'EmConf-CI'
}

export class UnexpectedError extends MoverError {
  constructor(protected readonly code: UECode) {
    super(`Unexpected error with code: ${code}`);
  }

  public getCode(): UECode {
    return this.code;
  }
}
