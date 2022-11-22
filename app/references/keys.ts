import APIKeysDefault from './keys/privateKeys.json';
import { APIKeys, PossibleAPIKey } from './types';

const OverrideKeys: Partial<APIKeys> = {};

export const getAPIKey = (apiKey: PossibleAPIKey): string => {
  const overrideValue = OverrideKeys[apiKey];
  if (overrideValue === undefined) {
    return APIKeysDefault[apiKey];
  }
  return overrideValue;
};
