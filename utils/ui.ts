import { Appearance } from "react-native";

export const isDarkMode = () => Appearance.getColorScheme() === "dark"

export const CSSShadows = {
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5
}