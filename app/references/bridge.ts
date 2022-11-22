export enum BridgeType {
  Synapse = 0,
  Across = 1,
  None = 'none'
}

export const mapBrideTypeToContractsConstant = (bt: BridgeType): number => {
  switch (bt) {
    case BridgeType.Synapse:
      return 0;
    case BridgeType.Across:
      return 1;
    case BridgeType.None:
      return 0;
  }
};
