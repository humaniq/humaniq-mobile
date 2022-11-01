import { colorsLight } from "app/theme/color"

export type ColorList = {
  [key in keyof typeof colorsLight]: string;
};

export type Theme = {
  colors: ColorList
};
