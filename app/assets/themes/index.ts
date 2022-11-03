import { Theme } from "types/theme"
import { colorsDark, colorsLight, fonts } from "app/theme/color"

export const DarkNightTheme: Theme = {
  colors: {
    ...colorsDark
  },
  fonts: {
    ...fonts
  }
}

export const LightMorningTheme: Theme = {
  colors: {
    ...colorsLight
  },
  fonts: {
    ...fonts
  }
}
