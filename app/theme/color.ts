import { Colors } from "react-native-ui-lib"

export const colorsLight = {
  primary: "#0066DA",
  error: "#F44336",
  success: "#4CAF50",
  warning: "#FD9900",
  textBlack: "#001833",
  black: "#001833",
  blueOcean: "#001833",
  textGrey: "#9B9B9B",
  bg: "#F5FAFF",
  grey: "#E0E0E0",
  greyLight: "#F2F3F6",
  greyLightSecond: "#EFF2F4"
}

export const colorsDark = {
  primary: "#0066DA",
  error: "#F44336",
  success: "#4CAF50",
  warning: "#FD9900",
  textBlack: "#001833",
  black: "#001833",
  blueOcean: "#001833",
  textGrey: "#9B9B9B",
  bg: "#F5FAFF",
  grey: "#E0E0E0",
  greyLight: "#F2F3F6",
  greyLightSecond: "#EFF2F4"
}

Colors.loadSchemes({
  light: colorsLight,
  dark: colorsDark
})
