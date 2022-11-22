import { Theme } from "types/theme"
import { colorsDark, colorsLight, fonts } from "app/theme/color"

export const DarkNightTheme: Theme = {
  colors: {
    ...colorsDark
  },
  fonts: {
    ...fonts
  },
  spaces: {
    h16: 16,
    h20: 20,
    h24: 24,
    v20: 20,
    v40: 32,
  },
  shadows: {}
}

export const LightMorningTheme: Theme = {
  colors: {
    ...colorsLight
  },
  fonts: {
    ...fonts
  },
  spaces: {
    h16: 16,
    h20: 20,
    h24: 24,
    v20: 20,
    v40: 32,
  },
  shadows: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3
  }
}
