import { StyleProp, TextProps, TextStyle } from "react-native"

export interface Props {
  text: string
  style?: StyleProp<TextStyle>,
  customPatterns?: ParseShape[];
}

export type ParseShape = DefaultParseShape | CustomParseShape;

export interface BaseParseShape
  extends Pick<TextProps, Exclude<keyof TextProps, 'onPress' | 'onLongPress'>> {
  renderText?: (matchingString: string, matches: string[]) => string;
  onPress?: (text: string, index: number) => void;
  onLongPress?: (text: string, index: number) => void;
}

export interface CustomParseShape extends BaseParseShape {
  pattern: string | RegExp;
  nonExhaustiveModeMaxMatchCount?: number;
}

export interface DefaultParseShape extends BaseParseShape {
  type: 'url' | 'phone' | 'email';
}
