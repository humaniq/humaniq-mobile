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
  horizontal: number
  vertical: number
}

export type Theme = {
  colors: ColorList;
  fonts: FontList;
  spaces: Space;
  shadows: any
};
