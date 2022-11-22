import { StyleProp, ViewStyle } from "react-native"

export interface ActivityIndicatorProps {
  color?: string;
  /**
   * Size of the indicator.
   */
  size?: "small" | "large" | number;
  /**
   * Whether the indicator should hide when not animating.
   */
  hidesWhenStopped?: boolean;
  style?: StyleProp<ViewStyle>;
}
