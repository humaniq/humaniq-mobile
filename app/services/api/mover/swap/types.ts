export type TransferData = {
  data: string;
  allowanceTarget: string;
  to: string;
  value: string;
  buyAmount: string;
  sellAmount: string;
  swappingVia: string;
  sellTokenToEthRate?: string;
  buyTokenToEthRate?: string;
};
