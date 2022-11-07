import { StatusBarStyle } from 'react-native';

export interface AppStatusBarInterface {
  animated?: boolean;
  backgroundColor?: string;
  barStyle?: StatusBarStyle;
  [x: string]: any;
}
