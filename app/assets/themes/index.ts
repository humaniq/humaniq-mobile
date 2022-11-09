import { Theme } from "types/theme"
import { colorsDark, colorsLight, fonts } from "app/theme/color"

export const DarkNightTheme: Theme = {
  colors: {
    ...colorsDark
  },
  fonts: {
    ...fonts
  },
  spaces: [2, 4, 8, 12, 16, 20, 24],
  fontSize: [10, 12, 14, 16, 18, 20, 22, 24],
}

export const LightMorningTheme: Theme = {
  colors: {
    ...colorsLight
  },
  fonts: {
    ...fonts
  },
  spaces: [2, 4, 8, 12, 16, 20, 24],
  fontSize: [10, 12, 14, 16, 18, 20, 22, 24],
}
