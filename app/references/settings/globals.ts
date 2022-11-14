import { Network } from '../network';

export type GlobalSettings = Array<Network> | boolean;

export interface Globals {
  isCardRegistrationEnabled: GlobalSettings;
  isIntercomEnabled: GlobalSettings;
  isTopUpForDifferentTagEnabled: GlobalSettings;
  isReferralLinkEnabled: GlobalSettings;
}

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

export const isDevelop = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

// enables console output in browser developer tools
export const isConsoleEnabled = (): boolean => {
  return process.env.VUE_APP_CONSOLE_LOGS === 'true';
};

const values: Globals = {
  isCardRegistrationEnabled: false,
  isIntercomEnabled: !isDevelop(),
  isTopUpForDifferentTagEnabled: true,
  isReferralLinkEnabled: false
};

export const isFeatureEnabled = <T extends keyof Globals>(key: T, network?: Network): boolean => {
  const settings = values[key] as GlobalSettings;
  if (typeof settings === 'boolean') {
    return settings;
  }
  if (network === undefined) {
    return true;
  }
  return settings.includes(network);
};
