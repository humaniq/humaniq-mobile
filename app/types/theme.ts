import { colorsLight } from "app/theme/color"

export type ColorList = {
  [key in keyof typeof colorsLight]: string;
};

export type FontList = {
  regular: string;
  medium: string;
  semi: string;
  bold: string;
};

export type Space = {
  h16: number
  h20: number
  h24: number
  v20: number
  v40: number
}

export type Theme = {
  colors: ColorList;
  fonts: FontList;
  spaces: Space;
  shadows: any
};
