import { Platform } from 'react-native';

export const noop = (..._: any[]) => {};

export const toLowerCase = (text: string) => text.toLowerCase();

export const IS_ANDROID = Platform.OS === 'android';

export const IS_IOS = !IS_ANDROID;
