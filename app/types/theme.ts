import { colorsLight } from "app/theme/color"

export type ColorList = {
  [key in keyof typeof colorsLight]: string;
};

export type FontList = {
  bold: string;
  medium: string;
  regular: string;
  semi: string;
};

export type Theme = {
  colors: ColorList;
  fonts: FontList;
};
